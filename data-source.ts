import { DataSource } from 'typeorm';
import { ormConfig } from './src/common/config/orm-config';
import { SeederOptions } from 'typeorm-extension';
import { Role } from '~/roles/entities/role.entity';
import { User } from '~/user/entities/user.entity';
import { UserOrder } from '~/order/entities/order.entity';

export const dataSource = new DataSource({
  ...ormConfig,
  entities: [Role, User, UserOrder],
  seeds: ['src/seeds/**/*{.ts,.js}'],
} as SeederOptions & typeof ormConfig);
