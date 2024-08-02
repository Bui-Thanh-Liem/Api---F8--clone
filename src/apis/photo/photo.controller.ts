import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { Response } from 'express';
import { ResponseOk } from 'src/abstracts/ABaseResponse.abstract';

@Controller('photos')
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPhoto(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const resultUploadPhoto = await this.photoService.createPhoto(file);
    return new ResponseOk({
      message: "Created photo successfully",
      data: resultUploadPhoto
    })
  }

  @Delete()
  async deletePhoto(
    @Body() dataForm: { public_id: string },
  ) {
    const resultDeletePhoto = await this.photoService.deletePhoto(
      dataForm.public_id,
    );
    return new ResponseOk({
      message: "Deleted photo successfully",
      data: resultDeletePhoto
    })
  }
}
