import { Api, ApiListResponse } from '../base/api';
import { IOrder, IOrderResult, IProduct } from '../../types';

export interface IAppAPI {
  getProductList: () => Promise<IProduct[]>;
}

export class ProductApi extends Api implements IAppAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  order(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}