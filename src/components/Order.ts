import { IOrder } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class Order extends Form<IOrder> {
  protected _cardPaymentButton: HTMLButtonElement; // Кнопка "Онлайн" (card)
  protected _cashPaymentButton: HTMLButtonElement; // Кнопка "При получении" (cash)

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._cardPaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._cashPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

    this._cardPaymentButton.addEventListener('click', () => {
      this.payment = 'card';
      this.onInputChange('payment', 'card');
    });

    this._cashPaymentButton.addEventListener('click', () => {
      this.payment = 'cash';
      this.onInputChange('payment', 'cash');
    });
  }

  set payment(name: string) {
    // Убираем активный класс у обеих кнопок
    this._cardPaymentButton.classList.remove('button_alt-active');
    this._cashPaymentButton.classList.remove('button_alt-active');

    // Добавляем активный класс выбранной кнопке
    if (name === 'card') {
      this._cardPaymentButton.classList.add('button_alt-active');
    } else if (name === 'cash') {
      this._cashPaymentButton.classList.add('button_alt-active');
    }
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

export class Contacts extends Form<IOrder> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
