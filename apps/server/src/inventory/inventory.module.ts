import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller.js';
import { InventoryService } from './inventory.service.js';

@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
