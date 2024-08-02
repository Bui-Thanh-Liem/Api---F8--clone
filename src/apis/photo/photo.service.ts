import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/libraries/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoEntity } from './photo.entity';
import { DeleteApiResponse } from 'cloudinary';
import { CloudinaryResponse } from 'src/libraries/cloudinary/cloudianry-response';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(PhotoEntity)
    private photoRepository: Repository<PhotoEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createPhoto(file: Express.Multer.File): Promise<CloudinaryResponse> {
    try {
      const uploadResult = await this.cloudinaryService.uploadImage({
        file: file,
        folderName: 'photos',
      });
      if(uploadResult.public_id) {
        return uploadResult
      }
    } catch (error) {
      throw new BadRequestException('Upload image failed');
    }
  }

  async deletePhoto(public_id: string): Promise<DeleteApiResponse> {
    try {
      const deleteResult = await this.cloudinaryService.deleteImage(public_id);
      if(deleteResult.http_code === 200) return deleteResult;
    } catch (error) {
      throw new BadRequestException('Delete image failed');
    }
  }
}
