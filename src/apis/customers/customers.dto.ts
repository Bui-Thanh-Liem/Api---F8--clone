import { ApiProperty } from "@nestjs/swagger";


export class CreateCustomerDto {
    @ApiProperty({type: String})
    username: string

    @ApiProperty({type: String})
    email: string

    @ApiProperty({type: String})
    image: string
}