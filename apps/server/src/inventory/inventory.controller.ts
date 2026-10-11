import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import {
  createProductBodySchema,
  type CreateProductBody,
  type Product,
} from '@repo/types';
import z from 'zod';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get('all')
  findAll(): Product[] {
    return this.inventoryService.findAll();
  }

  @Post('new')
  createProduct(@Body() body: CreateProductBody): Product {
    const createProductBodyParse = createProductBodySchema.safeParse(body);

    if (!createProductBodyParse.success) {
      throw new BadRequestException({
        status_code: 400,
        message: 'Bad Request.',
        errors: Object.fromEntries(
          Object.entries(
            Object(z.treeifyError(createProductBodyParse.error).properties),
          ).map((obj) => [obj[0], { ...Object(obj[1]) }?.errors ?? []]),
        ),
      });
    }

    return this.inventoryService.createProduct(body);
  }
}
