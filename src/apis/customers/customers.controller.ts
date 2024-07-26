import { v4 as uuid } from 'uuid';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './customers.dto';
import { ResponseData } from 'src/global/global.class';
import { HttpMessage, HttpStatusCode } from 'src/global/global.enum';
import { ICustomer } from 'src/interfaces/customer.model';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create Customers' })
  createCustomer(@Body() dataForm: CreateCustomerDto): ResponseData<ICustomer> {
    return new ResponseData<ICustomer>(
      this.customersService.createCustomer({ ...dataForm, id: uuid() }),
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update Customers' })
  updateCustomer(
    @Param('id') id: string,
    @Body() dataForm: CreateCustomerDto,
  ): ResponseData<ICustomer> {
    return new ResponseData<ICustomer>(
      this.customersService.updateCustomer(id, dataForm),
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get Customers' })
  getCustomerList(): ResponseData<ICustomer> {
    return new ResponseData<ICustomer>(
      this.customersService.getCustomerList(),
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Details Customer' })
  getCustomerDetails(@Param('id') id: string): ResponseData<ICustomer> {
    return new ResponseData<ICustomer>(
      this.customersService.getCustomerDetails(id),
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete Customers' })
  deleteCustomer(@Param('id') id: string): ResponseData<string> {
    return new ResponseData<string>(
      this.customersService.deleteCustomer(id),
      HttpMessage.SUCCESS,
      HttpStatusCode.SUCCESS,
    );
  }
}
