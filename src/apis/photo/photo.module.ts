import { Module } from "@nestjs/common";
import { PhotoController } from "./photo.controller";
import { PhotoService } from "./photo.service";
import { CloudinaryModule } from "src/libraries/cloudinary/cloudinary.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhotoEntity } from "./photo.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PhotoEntity]), CloudinaryModule],
    controllers: [PhotoController],
    providers: [PhotoService],
    exports: [PhotoService]
})

export class PhotoModule {}