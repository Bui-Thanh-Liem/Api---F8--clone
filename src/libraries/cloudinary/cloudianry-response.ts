import { UploadApiResponse, UploadApiErrorResponse, DeleteApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;