import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
  total: number; // общая сумма заказа
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _total: HTMLElement;
  protected _close: HTMLButtonElement;

  constructor(container: HTMLElement, protected actions?: ISuccessActions) {
    super(container);

    this._close = container.querySelector('.order-success__close');
    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
  }
  }

  set total(value: string) {
    this._total.textContent = `Списано ${value} синапсов`;
  }
}