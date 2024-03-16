import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private readonly uploadFolder = '/data'; // Pfad im Docker-Container

  async saveFile(buffer: Buffer, filename: string): Promise<string> {
    const savePath = path.join(this.uploadFolder, filename);

    if (!fs.existsSync(path.dirname(savePath))) {
      fs.mkdirSync(path.dirname(savePath), { recursive: true });
    }

    await fs.promises.writeFile(savePath, buffer);
    return savePath;
  }
}
