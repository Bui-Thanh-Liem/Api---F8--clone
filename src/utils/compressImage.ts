import * as sharp from 'sharp';

export async function compressImage(buffer: Buffer): Promise<Buffer> {
  try {
    // Nén hình ảnh với kích thước và chất lượng giảm
    const compressedBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: sharp.fit.inside, // Giữ nguyên tỷ lệ, phù hợp trong khung 800x800
        withoutEnlargement: true, // Không phóng to nếu ảnh nhỏ hơn kích thước đích
      })
      .webp({ quality: 70 }) // Chuyển đổi sang webp với chất lượng 70%
      .toBuffer();
    return compressedBuffer;
  } catch (error) {
    throw new Error('Error compressing image');
  }
}
