// src/projects/projects.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UsersService } from '../users/users.service'
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService, private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createProjectDto: CreateProjectDto): Promise<{ message: string; data: Project }> {
        // check instructor
        const userId = createProjectDto.userId; 
        const isInstructor : boolean = await this.usersService.checkUserRole(userId);

        if (!isInstructor) {
            throw new ForbiddenException('프로젝트를 생성할 권한이 없습니다.');
        }

        const data = await this.projectsService.create(createProjectDto);
        return {
            message: "프로젝트를 생성했습니다",
            data: data,
        };
    }

    @Get()
    findAll(): Promise<Project[]> {
        return this.projectsService.findAll();
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: Partial<UpdateProjectDto>): Promise<{ message: string; modification: Project }> {
        const modification = await this.projectsService.update(id, updateProjectDto);
        return {
            message: "프로젝트가 수정되었습니다",
            modification: modification,
        };
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.projectsService.remove(id);
    }
}
