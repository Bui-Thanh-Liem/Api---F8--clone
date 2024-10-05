import { Controller, Post, Get, Patch, Delete, Body, Req, UseGuards, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateBlogDto, UpdateBlogDto } from "./blogs.dto";
import { ResponseOk } from "src/abstracts/ABaseResponse.abstract";
import { Request } from "express";
import { BlogService } from "./blogs.service";
import { AuthGuard } from "src/guard/auth.guard";
import { TasksService } from "src/tasks/tasks.service";

@Controller('blog')
@ApiTags('blogs')
export class BlogController {
    constructor(
        private blogService: BlogService,
        private taskService: TasksService
    ) {}
    
    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({summary: "Create a new blog"})
    async create(@Body() dataForm: CreateBlogDto, @Req() req: Request) {
        
        const newBlog = await this.blogService.create(dataForm, req);
        this.taskService.createCronJob(newBlog);

        return new ResponseOk({
            message: "Create a new blog",
            data: newBlog
        })
    }

    @Patch()
    @ApiOperation({summary: "Update a blog"})
    async update(@Body() dataForm: UpdateBlogDto, @Param('id') id: string) {
        const updateBlog = await this.blogService.update(id, dataForm);
        this.taskService.updateCronTime(updateBlog);

        return new ResponseOk({
            message: "Update a blog",
            data: updateBlog
        })
    }

    @Get()
    @ApiOperation({summary: "Find all blog"})
    async findAll() {
        const blogs = await this.blogService.findAll();
        
        return new ResponseOk({
            message: "Find all blog successfully",
            data: blogs
        })
    }
}