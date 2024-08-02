import * as streamifier from 'streamifier';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CloudinaryDto } from './cloudinary.dto';
import { CloudinaryResponse } from './cloudianry-response';
import { v2 as cloudinary, DeleteApiResponse } from 'cloudinary';
import { compressImage } from 'src/utils/compressImage';

@Injectable()
export class CloudinaryService {
  async uploadImage({
    file,
    folderName,
  }: CloudinaryDto): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>(async (resolve, reject) => {
      const imageCompressed = await compressImage(file.buffer);

      // Tạo một upload stream từ cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (err, result) => {
          if (err) {
            return reject(new BadRequestException('Upload image failed'));
          }
          resolve(result);
        },
      );

      // Dùng streamifier để biến Buffer thành stream và pipe vào uploadStream
      streamifier.createReadStream(imageCompressed).pipe(uploadStream);
    });
  }

  async deleteImage(public_id: string): Promise<DeleteApiResponse> {
    return new Promise<DeleteApiResponse>(async (resolve, reject) => {
      cloudinary.uploader.destroy(public_id, {}, (err, result) => {
        if (err) {
          return reject(new BadGatewayException('Delete image failed'));
        }
        if (result.result === 'ok') {
          resolve(result);
        } else {
          reject(new BadGatewayException('Delete image failed'));
        }
      });
    });
  }
}
