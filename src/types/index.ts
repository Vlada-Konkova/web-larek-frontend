// Интерфейс представления главной страницы
interface IMain {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

//определяем тип для категории товара
type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

//Интерфейс для карточки товара
interface IProduct {
  id: string;  //  идентификатор товара
  image: string;  // изображение товара
  title: string;  // наименование товара
  category: ProductCategory;  // категория продукта
  price: number | null;  // цена товара
  description: string;  // описание товара
}

//Интерфейс для списка товаров на главной страницы
interface IProductList {
  productList: IProduct[];  // массив товаров
}

//Интерфейс для корзины
interface IOrderBasket {
  basketItems: IProduct[]; // массив товаров в корзине
  totalPrice: number; // общая сумма заказа в корзине
}

//Интерфейс для заказа
interface IOrderForm {
  basket: IOrderBasket;  // выбранные товары(массив товаров)
  paymentMethod: string;  // метод оплаты
  address: string;  // адрес доставки
  email: string;  // почта пользователя
  phone: string;  // телефон пользователя
}