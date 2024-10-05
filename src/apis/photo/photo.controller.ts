import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { ResponseOk } from 'src/abstracts/ABaseResponse.abstract';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('photos')
@ApiTags("Photo")
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @Post()
  @ApiOperation({summary: "Create a photo"})
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
  @ApiOperation({summary: "Delete a photo"})
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
