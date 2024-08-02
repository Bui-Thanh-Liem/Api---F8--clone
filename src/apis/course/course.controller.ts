import { Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

@Controller("/course")
export class CourseController {


    @Post()
    @ApiOperation({summary: "Create a new Course"})
    async createCourse() {

    }
}