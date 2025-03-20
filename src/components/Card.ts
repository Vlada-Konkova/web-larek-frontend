// работа для одной карточки
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import {Component} from "./base/Component";

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

const categoryColors: { [key: string]: string} = {
	'софт-скил' : 'card__category_soft',
	'хард-скил' : 'card__category_hard',
	'кнопка' : 'card__category_button',
	'дополнительное' : 'card__category_additional',
	'другое' : 'card__category_other',
};

export class Card extends Component<IProduct>{
  protected _category: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._category = ensureElement<HTMLElement>('.card__category', container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._button = container.querySelector(`.card__button`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `card__category ${categoryColors[value]}`;
  }

  get category(): string {
    return this._category?.textContent || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set price(value: number) {
    this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    if (this._button) {
      this._button.disabled = value <= 0; // Делаем кнопку неактивной, если цена меньше 0
    }
  }
  
  // устанавливает текст на кнопке, когда добавляем товар в корзину
  setButtonState(added: boolean) {
    if (this._button) {
      this._button.disabled = added;
      this._button.textContent = added ? 'Добавлено' : 'В корзину';
    }
  }
}

export class ProductDetail extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    this._description = container.querySelector(`.card__text`);
  }

  set description(value: string) {
    this._description.textContent = value;
  }
}