import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { ProjectDocService } from './project_doc.service';
import { CreateProjectDocDto } from './dto/create-project_doc.dto';
import { UpdateProjectDocDto } from './dto/update-project_doc.dto';

@Controller('project-doc')
export class ProjectDocController {
    constructor(private readonly projectDocService: ProjectDocService) {}

    @Post()
    async create(@Body() createProjectDocDto: CreateProjectDocDto) {
        return await this.projectDocService.create(createProjectDocDto);
    }

    @Get()
    async findAll() {
        return await this.projectDocService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.projectDocService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateProjectDocDto: UpdateProjectDocDto
    ) {
        return await this.projectDocService.update(id, updateProjectDocDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.projectDocService.remove(id);
    }
}
