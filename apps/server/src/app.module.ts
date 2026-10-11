import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { InventoryModule } from './inventory/inventory.module.js';

@Module({
  imports: [InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
