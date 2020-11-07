import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';
import uploadConfig from '@config/upload';

export default async function normalizeImage(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const originalFileName = path.resolve(
    uploadConfig.tmpFolder,
    request.file.filename,
  );
  const tmpCopyFileName = path.resolve(
    uploadConfig.tmpFolder,
    `tmp${Date.now()}_${request.file.filename}`,
  );

  await fs.promises.copyFile(originalFileName, tmpCopyFileName);

  await sharp(tmpCopyFileName)
    .resize(300, 300)
    .jpeg({ progressive: true, quality: 80 })
    .toFile(originalFileName);

  await fs.promises.unlink(tmpCopyFileName);

  return next();
}
