import { IProduct, IAppState, IOrder, FormErrors, IOrderForm, IContactForm } from '../types';
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
  catalog: IProduct[];
};

export class AppState extends Model<IAppState> {
  catalog: IProduct[];
  basket: IProduct[] = [];
  order: IOrder = {
    total: 0,
    items: [],
    payment: '',
    address: '', 
    email: '',
    phone: '',
  }
  preview: string | null;
  formErrors: FormErrors = {};
  counter: number = 0; // Счетчик товаров в корзине

  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: IProduct) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  addProduct(value: IProduct) {
    const existingProduct = this.basket.find(item => item.id === value.id);
    if (!existingProduct) {
      this.basket.push(value);
      this.counter++;
      this.order.items.push(value.id);
      // Уведомляем об изменениях в корзине
      this.emitChanges('basket:changed', { basket: this.basket, counter: this.counter });
    }
  }

  removeProduct(product: IProduct) {
    this.basket = this.basket.filter((item) => item.id !== product.id);
    this.counter--;
    // Уведомляем об изменениях в корзине
    this.emitChanges('basket:changed', { basket: this.basket, counter: this.counter });
  }

  clearBasket() {
    this.basket = [];
    // Уведомляем об изменениях в корзине
    this.emitChanges('basket:changed', { basket: this.basket });
  }

  getTotal() {
    return this.basket.reduce((total, item) => total + item.price, 0);
  }  

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;
    
    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }
  }

  setContactsField(field: keyof IContactForm, value: string) {
      this.order[field] = value;

      if (this.validateContacts()) {
        this.events.emit('contacts:ready', this.order);
      }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
      errors.payment = 'Укажите способ оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Укажите адрес';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }


  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  clearForm() {
		this.order.address = '';
		this.order.payment = '';
    this.order.email = '';
		this.order.phone = '';
	}
}
