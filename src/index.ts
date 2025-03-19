import './scss/styles.scss';

import { IContactForm, IOrderForm, IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants'; 
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Card, ProductDetail } from './components/Card';
import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Modal } from './components/common/Modal';
import { Basket, ProductBasket } from './components/common/Basket';
import { Contacts, Order } from './components/Order';
import { Success } from './components/common/Success';
import { ProductApi } from './components/common/ProductApi';

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создание экземпляра API
const api = new ProductApi(CDN_URL, API_URL);
const events = new EventEmitter();
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Модель данных приложения
const appData = new AppState({}, events);

// Список карточек
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
  });
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// отображение карточки
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

// Открыть подробное описание товара
events.on('preview:changed', (item: IProduct) => {
  const product = new ProductDetail(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('card:toBasket', item);
    },
  });

  // Проверяем, находится ли товар в корзине
  const isInBasket = appData.basket.some((basketItem) => basketItem.id === item.id);
  product.setButtonState(isInBasket); // Обновляем состояние кнопки

  modal.render({
    content: product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
    }),
  });
});

// добавить в корзину карточку товара
events.on('card:toBasket', (item: IProduct) => {
  appData.addProduct(item);

  // Обновляем состояние кнопки в карточке
  const cardElement = document.querySelector(`[data-id="${item.id}"]`);
  if (cardElement) {
    const card = new Card(cardElement as HTMLElement);
    card.setButtonState(true); // Делаем кнопку неактивной и меняем текст
  }
});

// счетчик количества товара на главной странице, которое добавили в корзину
events.on('basket:changed', () => {
  page.counter = appData.counter; // Обновляем счетчик из данных события
});

// открыть корзину с выбранными товарами
events.on('basket:open', () => {
  modal.render({ 
    content: basket.render({
      totalPrice: appData.getTotal()
    })
  });

  // Обновляем состояние кнопок для всех товаров в корзине
  appData.basket.forEach(item => {
    const cardElement = document.querySelector(`[data-id="${item.id}"]`);
    if (cardElement) {
      const card = new Card(cardElement as HTMLElement);
      card.setButtonState(true); // Делаем кнопку неактивной и меняем текст
    }
  });
});

// удаление из корзины
events.on('basket:remove', (item: IProduct) => {
  appData.removeProduct(item);

  // Обновляем состояние кнопки в карточке
  const cardElement = document.querySelector(`[data-id="${item.id}"]`);
  if (cardElement) {
    const card = new Card(cardElement as HTMLElement);
    card.setButtonState(false); // Делаем кнопку активной и меняем текст
  }
});

// Обновление корзины
events.on('basket:changed', () => {
  const basketItems = appData.basket.map((item, index) => {
    const cardBasket = new ProductBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('basket:remove', item),
    })

    cardBasket.index = index;
      return cardBasket.render({
          title: item.title,
          price: item.price,
      });
  });

  basket.render({ basketItems, totalPrice: appData.getTotal() });
});

// открыть форму способа оплаты
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// открыть форму контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
      phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы способа оплаты
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IContactForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей способа оплаты
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// Изменилось одно из полей контактов
events.on(/^contacts\..*:change/, (data: { field: keyof IContactForm, value: string }) => {
  appData.setContactsField(data.field, data.value);
});

// Изменилось поле ввода оплаты
events.on(`order.payment:change`, (data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// открыть форму успешной покупки
events.on('contacts:submit', () => {
  // передача данных
  appData.order.items.length;
  appData.order.total;
  appData.order.total = appData.getTotal();
  appData.order.payment;
  appData.order.address;
  appData.order.email;
  appData.order.phone;
 
  api.order(appData.order)
    .then((result) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
          appData.clearBasket();
          page.counter = 0;
          appData.counter = 0;
          appData.clearForm();
        }
      });
      modal.render({
        content: success.render({
          total: result.total,
        })
      });
    })
    .catch(err => {
      console.error(err);
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

// Получение данных карточек с сервера
api.getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => console.log('Ошибка при получении данных: ', err));
