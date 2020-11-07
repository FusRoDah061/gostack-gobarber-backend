import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class DatabaseStorageProvider implements IStorageProvider {
  public async save(file: string): Promise<string> {
    const fileData = await fs.promises.readFile(
      path.resolve(uploadConfig.tmpFolder, file),
    );

    const base64Encoded = fileData.toString('base64');

    return base64Encoded;
  }

  public async delete(_file: string): Promise<void> {
    // Não precisa fazer nada pois o arquivo não existe.
  }
}
