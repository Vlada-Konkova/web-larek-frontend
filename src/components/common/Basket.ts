import { IBasket, IProduct } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class Basket extends Component<IBasket> {
  protected _basketItems: HTMLElement;
  protected _totalPrice: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._basketItems = ensureElement<HTMLElement>('.basket__list', this.container);
    this._totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = this.container.querySelector('.basket__button');

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }
    
    this.basketItems = [];
  }

  set basketItems(items: HTMLElement[]) {
    if (items.length) {
      this._basketItems.replaceChildren(...items);
      this.setDisabled(this._button, false);
    } else {
      this.setDisabled(this._button, true);
      this._basketItems.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
        }));
    }
  }

  set totalPrice(totalPrice: number) {
    this.setText(this._totalPrice, `${totalPrice.toString()} синапсов`);
  }
}

export interface IProductBasket extends IProduct {
  index: number;
  id: string;
}

export interface IActionsBasket {
  onClick: (event: MouseEvent) => void;
}

export class ProductBasket extends Component<IProductBasket>{
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;
  
  constructor(container: HTMLElement, actions?: IActionsBasket) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.card__title`, this.container);
    this._index = ensureElement<HTMLElement>(`.basket__item-index`, this.container);
    this._price = ensureElement<HTMLElement>(`.card__price`, this.container);
    this._deleteButton = ensureElement<HTMLButtonElement>(`.card__button`, this.container);

    if (this._deleteButton) {
      this._deleteButton.addEventListener('click', (evt) => {
        this.container.remove();
        actions?.onClick(evt);
      });
    }
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set index(value: number) {
    this.setText(this._index, value + 1);
  }

  set price(price: number) {
    this.setText(this._price, `${price.toString()} синапсов`);
  }
}
