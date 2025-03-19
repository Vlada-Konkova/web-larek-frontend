// Интерфейс представления главной страницы
export interface IAppState {
  counter: number; // счетчик у корзины
  catalog: IProduct[]; // список товаров
  basket: IProduct[]; // корзина
  preview: string | null; // детальное описание товара
  order: IOrder | null; // форма заказа
}

//Интерфейс для карточки товара
export interface IProduct {
  id: string;  //  идентификатор товара
  image: string;  // изображение товара
  title: string;  // наименование товара
  category: string;  // категория продукта
  price: number | null;  // цена товара
  description: string;  // описание товара
}

//Интерфейс для корзины
export interface IBasket {
  basketItems: HTMLElement[]; // массив товаров в корзине
  totalPrice: number; // общая сумма заказа в корзине
}

//Интерфейс для заказа
export interface IOrder extends IOrderForm, IContactForm {
	total: number;
	items: string[];
}

// Интерфейс для формы заказа(способ оплаты, адрес)
export interface IOrderForm {
  payment: string; // способ оплаты
  address: string; // адрес
}

// Интерфейс для формы контактов(почта и телефон)
export interface IContactForm {
  email: string; // почта
  phone: string; // телефон
}

// Интерфейс для вывода успешной покупки
export interface IOrderResult {
  id: string; // идентификатор товара
  total: number; // общая сумма заказа
}

// для ошибок
export type FormErrors = Partial<Record<keyof IOrder, string>>;