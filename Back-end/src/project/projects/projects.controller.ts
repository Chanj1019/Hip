import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UsersService } from '../../user/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { RolesGuard } from '../../auth/roles.guard'; // 역할 기반 가드 임포트
import { Roles } from '../../auth/roles.decorator'; // 역할 데코레이터 임포트
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService, private readonly usersService: UsersService) {}

    @Post()
    @Roles('admin')
    async create(@Body() createProjectDto: CreateProjectDto): Promise<{ message: string; data: Project }> {
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
    @Roles('instructor')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: Partial<UpdateProjectDto>): Promise<{ message: string; modification: Project }> {
        const modification = await this.projectsService.update(id, updateProjectDto);
        return {
            message: "프로젝트가 수정되었습니다",
            modification: modification,
        };
    }

    @Delete(':id')
    @Roles('admin')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.projectsService.remove(id);
    }
}
