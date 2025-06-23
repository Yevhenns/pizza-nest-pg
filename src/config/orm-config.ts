import { DataSourceOptions } from 'typeorm';

export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nostra_db',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};
