import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IGetManyItem } from 'src/interfaces/common/commom.interface';

Injectable();
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(dataForm: UserDto): Promise<UserEntity> {
    const findUserByEmail = await this.userRepository.findOne({
      where: { email: dataForm.email },
      // where: [{ email: dataForm.email  }, { fullname: dataForm.fullname  }],
    });
    if (findUserByEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Otp

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dataForm.password, salt);

    const user = this.userRepository.create({
      ...dataForm,
      password: hashedPassword,
    });
    // const { password, ...res } = await this.userRepository.save(user);
    return await this.userRepository.save(user);
  }

  async update(id: string, dataForm: UserDto): Promise<UserEntity> {
    //
    const findUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!findUser) {
      throw new BadRequestException(`Not found user with id ${id} !`);
    }

    //
    findUser.fullname = dataForm.fullname;
    findUser.email = dataForm.email;
    findUser.birth = dataForm.birth;

    return this.userRepository.save(findUser);
  }

  async findAll(): Promise<IGetManyItem<UserEntity>> {
    const [users, totals] = await this.userRepository
      .createQueryBuilder('user')
      .getManyAndCount();
    return {
      items: users,
      totalItems: totals,
    };
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const findUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!findUser) {
      return false;
    }
    await this.userRepository.delete(id);
    return true;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }
}
