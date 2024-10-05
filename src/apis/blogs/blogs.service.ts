import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './blogs.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto, UpdateBlogDto } from './blogs.dto';
import { Request } from 'express';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
  ) {}

  async create(dataForm: CreateBlogDto, req: Request) {
    try {
      const currentUser = await req['user'];

      const blog = this.blogRepository.create({
        ...dataForm,
        creator: currentUser,
      });

      const newBlog = await this.blogRepository.save(blog);
      return newBlog;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dataForm: UpdateBlogDto) {
    try {
      const blogCheck = await this.blogRepository.findOne({where: {id: id}});
      if(!blogCheck) {
        throw new NotFoundException('Not found blog');
      }
      const updatedBlog = await this.blogRepository.update(id, dataForm);
      return blogCheck;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const blogs = await this.blogRepository
        .createQueryBuilder('blog')
        .skip(0)
        .take(20)
        .getMany()
      return {
        items: blogs,
      };
    } catch (error) {
      throw error;
    }
  }

  async setPostBelongTimer(id: string) {
    try {
      const postBlog = await this.blogRepository.findOne({ where: { id: id } });
      if (!postBlog) {
        throw new NotFoundException('Not found post blog');
      }
      postBlog.isPost = true;
      this.blogRepository.save(postBlog);
    } catch (error) {
      throw error;
    }
  }
}
