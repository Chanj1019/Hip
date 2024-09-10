import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { Project } from '../projects/entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Status } from '../enums/role.enum'


describe('ProjectsService', () => {
    let service: ProjectsService;
    let repository: Repository<Project>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                {
                    provide: getRepositoryToken(Project),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
        repository = module.get<Repository<Project>>(getRepositoryToken(Project));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new project', async () => {
            const createProjectDto: CreateProjectDto = {
                title: 'Test Project',
                team_name: 'Test Team',
                status: Status.IN_PROGRESS,
                userId: 1,
            };

            const savedProject = { ...createProjectDto, project_id: 1 };
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'create').mockReturnValue(savedProject as any);
            jest.spyOn(repository, 'save').mockResolvedValue(savedProject as any);

            expect(await service.create(createProjectDto)).toEqual(savedProject);
        });

        it('should throw ConflictException if team_name already exists', async () => {
            const createProjectDto: CreateProjectDto = {
                title: 'Test Project',
                team_name: 'Existing Team',
                status: Status.IN_PROGRESS,
                userId: 1,
            };

            jest.spyOn(repository, 'findOne').mockResolvedValueOnce({ team_name: 'Existing Team' } as any);

            await expect(service.create(createProjectDto)).rejects.toThrow(
                new ConflictException('Existing Team팀은(는) 이미 존재합니다.'),
            );
        });

        it('should throw ConflictException if title already exists', async () => {
          const createProjectDto: CreateProjectDto = {
              title: 'Existing Title',
              team_name: 'Unique Team', // 팀 이름을 고유하게 설정
              status: Status.IN_PROGRESS,
              userId: 1,
          };
      
          // team_name은 존재하지 않는 것으로 설정
          jest.spyOn(repository, 'findOne')
              .mockResolvedValueOnce(null) // team_name 중복 체크
              .mockResolvedValueOnce({ title: 'Existing Title' } as any); // title 중복 체크
      
          await expect(service.create(createProjectDto)).rejects.toThrow(
              new ConflictException('topic은(는) 이미 존재합니다.'),
          );
      });
      
      
    });

    describe('findAll', () => {
        it('should return an array of projects', async () => {
            const result = [{ project_id: 1, title: 'Test Project', team_name: 'Test Team', status: 'in_progress' }];
            jest.spyOn(repository, 'find').mockResolvedValue(result as any);

            expect(await service.findAll()).toEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return a single project by ID', async () => {
            const result = { project_id: 1, title: 'Test Project', team_name: 'Test Team', status: 'in_progress' };
            jest.spyOn(repository, 'findOne').mockResolvedValue(result as any);

            expect(await service.findOne(1)).toEqual(result);
        });

        it('should throw NotFoundException if project does not exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(
                new NotFoundException('ID가 1인 프로젝트를 찾을 수 없습니다.'),
            );
        });
    });

    describe('update', () => {
        it('should update and return a project', async () => {
            const updateProjectDto: UpdateProjectDto = { title: 'Updated Title', team_name: 'Updated Team' };
            const existingProject = { project_id: 1, title: 'Old Title', team_name: 'Old Team', status: 'in_progress' };
            const updatedProject = { ...existingProject, ...updateProjectDto };

            jest.spyOn(service, 'findOne').mockResolvedValue(existingProject as any);
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedProject as any);

            expect(await service.update(1, updateProjectDto)).toEqual(updatedProject);
        });

        it('should throw ConflictException if team_name already exists', async () => {
            const updateProjectDto: UpdateProjectDto = { team_name: 'Existing Team' };
            const existingProject = { project_id: 1, team_name: 'Old Team' };
            const existingTeam = { project_id: 2, team_name: 'Existing Team' };

            jest.spyOn(service, 'findOne').mockResolvedValue(existingProject as any);
            jest.spyOn(repository, 'findOne').mockResolvedValue(existingTeam as any);

            await expect(service.update(1, updateProjectDto)).rejects.toThrow(
                new ConflictException('Existing Team팀은(는) 이미 존재합니다.'),
            );
        });

        it('should throw ConflictException if title already exists', async () => {
            const updateProjectDto: UpdateProjectDto = { title: 'Existing Title' };
            const existingProject = { project_id: 1, title: 'Old Title' };
            const existingTitle = { project_id: 2, title: 'Existing Title' };

            jest.spyOn(service, 'findOne').mockResolvedValue(existingProject as any);
            jest.spyOn(repository, 'findOne').mockResolvedValue(existingTitle as any);

            await expect(service.update(1, updateProjectDto)).rejects.toThrow(
                new ConflictException('프로젝트 topic이(가) 이미 존재합니다.'),
            );
        });
    });

    describe('remove', () => {
        it('should remove a project', async () => {
            const project = { project_id: 1, title: 'Test Project', team_name: 'Test Team', status: 'in_progress' };
            jest.spyOn(service, 'findOne').mockResolvedValue(project as any);
            jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

            await expect(service.remove(1)).resolves.toBeUndefined();
        });
    });
});
