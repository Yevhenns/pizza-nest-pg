import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ormConfig } from './config/orm-config';
import { CategoriesModule } from './catalog/categories/categories.module';

import { ProductsModule } from './catalog/products/products.module';
import { SupplementsModule } from './catalog/supplements/supplements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig),
    RolesModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    SupplementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
