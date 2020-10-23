import { ConnectionOptions, createConnections } from 'typeorm';

const rootDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';

let postgresConnection: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  entities: [
    `./${rootDir}/modules/**/infra/typeorm/entities/*.${fileExtension}`,
  ],
  migrations: [
    `./${rootDir}/shared/infra/typeorm/migrations/*.${fileExtension}`,
  ],
  cli: {
    migrationsDir: `./${rootDir}/shared/infra/typeorm/migrations`,
  },
};

if (process.env.DATABASE_URL) {
  postgresConnection = {
    ...postgresConnection,
    url: process.env.DATABASE_URL,
  };
} else {
  postgresConnection = {
    ...postgresConnection,
    host: process.env.DEFAULT_DATABASE_HOST,
    port: Number(process.env.DEFAULT_DATABASE_PORT || 5432),
    username: process.env.DEFAULT_DATABASE_USER,
    password: process.env.DEFAULT_DATABASE_PASSWORD,
    database: process.env.DEFAULT_DATABASE_NAME,
  };
}

let mongoConnection: ConnectionOptions = {
  name: 'mongo',
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: [
    `./${rootDir}/modules/**/infra/typeorm/schemas/*.${fileExtension}`,
  ],
};

if (process.env.MONGO_URL) {
  mongoConnection = {
    ...mongoConnection,
    url: process.env.MONGO_URL,
  };
} else {
  mongoConnection = {
    ...mongoConnection,
    host: process.env.MONGO_DATABASE_HOST,
    port: Number(process.env.MONGO_DATABASE_PORT || 27017),
    database: process.env.MONGO_DATABASE_NAME,
  };
}

// Caso não seja informado parêmtro, irá busca pelo ormconfig.json
createConnections([postgresConnection, mongoConnection]);
