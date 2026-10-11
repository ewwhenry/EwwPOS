import { Injectable } from '@nestjs/common';
import {
  type CreateProductBody,
  type Product,
  createProductBodySchema,
} from '@repo/types';

class ProductBuilder {
  private data: Product;
  constructor(data: CreateProductBody) {
    this.data = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
      stock: 0,
      is_active: true,
    };
  }

  public get() {
    return this.data;
  }
}

@Injectable()
export class InventoryService {
  private readonly inventory: Product[] = [];

  findAll(): Product[] {
    return this.inventory;
  }

  createProduct(productData: CreateProductBody): Product {
    const newProduct = new ProductBuilder(productData).get();
    this.inventory.push(newProduct);
    return newProduct;
  }
}
