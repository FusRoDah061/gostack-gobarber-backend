import { createConnections } from 'typeorm';

const rootDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';

// Caso não seja informado parêmtro, irá busca pelo ormconfig.json
createConnections([
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DEFAULT_DATABASE_HOST,
    port: Number(process.env.DEFAULT_DATABASE_PORT || 5432),
    username: process.env.DEFAULT_DATABASE_USER,
    password: process.env.DEFAULT_DATABASE_PASSWORD,
    database: process.env.DEFAULT_DATABASE_NAME,
    entities: [
      `./${rootDir}/modules/**/infra/typeorm/entities/*.${fileExtension}`,
    ],
    migrations: [
      `./${rootDir}/shared/infra/typeorm/migrations/*.${fileExtension}`,
    ],
    cli: {
      migrationsDir: `./${rootDir}/shared/infra/typeorm/migrations`,
    },
  },
  {
    name: 'mongo',
    type: 'mongodb',
    url: `mongodb+srv://${process.env.MONGO_DATABASE_USER}:${process.env.MONGO_DATABASE_PASSWORD}@${process.env.MONGO_DATABASE_HOST}/${process.env.MONGO_DATABASE_NAME}`,
    useUnifiedTopology: true,
    entities: [
      `./${rootDir}/modules/**/infra/typeorm/schemas/*.${fileExtension}`,
    ],
  },
]);
