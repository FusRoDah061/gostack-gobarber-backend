import { container } from 'tsyringe';
import uploadConfig from '@config/upload';
import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';
import IStorageProvider from './models/IStorageProvider';
import DatabaseStorageProvider from './implementations/DatabaseStorageProvider';

const providers = {
  db: DatabaseStorageProvider,
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
