import { DataSource } from 'typeorm';

export const db = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: ['src/entity/*.{js,ts}'],
  logging: true,
  synchronize: true,
});
