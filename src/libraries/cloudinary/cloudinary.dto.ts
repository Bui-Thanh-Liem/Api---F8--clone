export class CloudinaryDto {
    file: Express.Multer.File;
    folderName: string;
}

interface MulterFile_Informational {
    fieldname: string; // Tên của trường trong form (input) mà file được đính kèm
    originalname: string; // Tên gốc của file trên máy tính của người dùng
    encoding: string; // Kiểu encoding của file (ví dụ: '7bit', 'utf8')
    mimetype: string; // Kiểu MIME của file (ví dụ: 'image/png', 'application/pdf')
    size: number; // Kích thước của file (tính bằng bytes)
    destination: string; // Thư mục mà file được lưu trữ tạm thời trên server
    filename: string; // Tên của file khi được lưu trên server (thường là một chuỗi duy nhất do Multer tạo ra)
    path: string; // Đường dẫn đầy đủ đến file trên server
    buffer: Buffer; // Bộ đệm (buffer) chứa nội dung của file, chỉ có khi file được lưu trữ trong bộ nhớ (memory storage)
  }