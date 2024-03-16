import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
  StreamableFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { createReadStream, existsSync } from 'fs';
import { AuthGuard } from '@nestjs/passport';
import * as sharp from 'sharp';
import path from 'path';

import { CreateMediaRequest } from '../../domains/medias/data-transfer-objects/create-media-request.dto';
import { DeleteMediaRequest } from '../../domains/medias/data-transfer-objects/delete-media-request.dto';

import { CreateMediaResponse } from '../../domains/medias/data-transfer-objects/create-media-response.dto';
import { GetMediaListResponse } from '../../domains/medias/data-transfer-objects/get-media-list-response.dto';

import { CreateMediaCommand } from '../../domains/medias/commands/create-media.command';
import { DeleteMediaCommand } from '../../domains/medias/commands/delete-media.command';

import { GetAllMediasQuery } from '../../domains/medias/queries/get-all-medias.query';
import { GetMediaByIdQuery } from '../../domains/medias/queries/get-media-by-id.query';

@Controller('medias')
export class MediasController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  async getMedia(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
    @Query('w') width?: number,
    @Query('h') height?: number,
    @Query('q') quality?: number,
  ) {
    const media = await this.queryBus.execute(new GetMediaByIdQuery(id));

    if (!existsSync(media.filepath)) {
      res
        .status(404)
        .send('Die angeforderte Mediendatei wurde nicht gefunden.');
      return;
    }

    const scalableImageTypes = ['image/jpeg', 'image/png'];
    const displayInlineTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (displayInlineTypes.includes(media.type)) {
      if (scalableImageTypes.includes(media.type) && (width || height)) {

        try {
          const filepath = media.filepath;
          const separator = process.platform === 'win32' ? '\\' : '/';
          const lastSlashIndex = filepath.lastIndexOf(separator);
          const directoryPath = filepath.substring(0, lastSlashIndex);
          const fileNameWithExtension = filepath.substring(lastSlashIndex + 1);
          const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
          const extension = fileNameWithExtension.substring(lastDotIndex + 1);
          const fileName = fileNameWithExtension.substring(0, lastDotIndex);

          if(width && !height) {
            const resizedFilePath = directoryPath + separator + fileName + "_w_" + width + "." + extension;
            if (!existsSync(resizedFilePath)) {
              sharp(media.filepath)
                .resize(parseInt(String(width), 0), null)
                .toFile(resizedFilePath, function (err) {
                  console.log(err);
                });
            }
            res.set('Content-Type', media.type);   
            res.set('Content-Disposition', `inline; filename="${media.filename}"`);
            return new StreamableFile(createReadStream(resizedFilePath));
          } else if(!width && height) {
            const resizedFilePath = directoryPath + separator + fileName + "_h_" + height+ "." + extension;
            if (!existsSync(resizedFilePath)) {
              sharp(media.filepath)
                .resize(null, parseInt(String(height), 0))
                .toFile(resizedFilePath, function (err) {
                  console.log(err);
                });
            }
            res.set('Content-Type', media.type);   
            res.set('Content-Disposition', `inline; filename="${media.filename}"`);
            return new StreamableFile(createReadStream(resizedFilePath));
          } else if(width && height) {
            const resizedFilePath = directoryPath + separator + fileName + "_w_" + width + "_h_" + height + "." + extension;
            if (!existsSync(resizedFilePath)) {
              sharp(media.filepath)
                .resize(parseInt(String(width), 0), parseInt(String(height), 0))
                .toFile(resizedFilePath, function (err) {
                  console.log(err);
                });
            }
            res.set('Content-Type', media.type);   
            res.set('Content-Disposition', `inline; filename="${media.filename}"`);
            return new StreamableFile(createReadStream(resizedFilePath));
          } else {
            res.set('Content-Type', media.type);   
            res.set('Content-Disposition', `inline; filename="${media.filename}"`);
            return new StreamableFile(createReadStream(media.filepath));
          }
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .send(
              'Die angeforderte Mediendatei konnte nicht verarbeitet werden.',
            );
          return;
        }
      } else {
        const file = createReadStream(media.filepath);
        res.set({
          'Content-Type': media.type,
        });

        res.set('Content-Disposition', `inline; filename="${media.filename}"`);
        return new StreamableFile(file);
      }

    } else {
      const file = createReadStream(media.filepath);
      res.set({
        'Content-Type': media.type,
      });

      res.set(
        'Content-Disposition',
        `attachment; filename="${media.filename}"`,
      );

      return new StreamableFile(file);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file): Promise<CreateMediaResponse> {
    return this.commandBus.execute<CreateMediaCommand, CreateMediaResponse>(
      new CreateMediaCommand({
        buffer: file.buffer,
        size: file.size,
        type: file.mimetype,
        filename: file.originalname,
      } as CreateMediaRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(): Promise<GetMediaListResponse[]> {
    return this.queryBus.execute(new GetAllMediasQuery());
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(@Body() deletMediaRequest: DeleteMediaRequest): Promise<boolean> {
    return this.commandBus.execute<DeleteMediaCommand, boolean>(
      new DeleteMediaCommand(deletMediaRequest),
    );
  }
}
