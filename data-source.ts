import { DataSource } from 'typeorm';
import { ormConfig } from './src/config/orm-config';
import { SeederOptions } from 'typeorm-extension';

export const dataSource = new DataSource({
  ...ormConfig,
  seeds: ['src/seeds/**/*{.ts,.js}'],
} as SeederOptions & typeof ormConfig);
