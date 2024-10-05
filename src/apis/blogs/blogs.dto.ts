import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ITimer } from './blogs.entity';

export class CreateBlogDto {
  @ApiProperty({ type: String, default: 'Title blog 1' })
  title: string;

  @ApiProperty({ type: String, default: 'Description blog 1' })
  description: string;

  @ApiProperty({
    type: String,
    default: `{
        "type": "HOURS"
        "value": "4"
    }`,
  })
  timer: ITimer;
}
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
