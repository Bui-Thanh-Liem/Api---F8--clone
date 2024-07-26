import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './customers.dto';
import { ICustomer } from 'src/interfaces/customer.model';

Injectable();
export class CustomersService {
  private customers: ICustomer[] = [
    {
      id: '1',
      email: 'liem@gmail.com',
      username: 'Liem',
      image: 'https://images/liem',
    },
  ];

  createCustomer(dataForm: ICustomer): ICustomer {
    this.customers.push(dataForm);
    return dataForm;
  }

  updateCustomer(id: string, dataForm: CreateCustomerDto): ICustomer {
    let index = this.customers.findIndex((customer) => customer.id === id);
    this.customers[index] = {
      ...this.customers[index],
      ...dataForm,
    };
    return this.customers[index];
  }

  getCustomerList(): ICustomer[] {
    return this.customers;
  }

  getCustomerDetails(id: string): ICustomer {
    return this.customers.find((customer) => customer.id === id);
  }

  deleteCustomer(id: string): string {
    return `Delete Customer id: ${id}`;
  }
}
