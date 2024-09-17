// import { Test, TestingModule } from '@nestjs/testing';
// import { ProjectsController } from './projects.controller';
// import { ProjectsService } from './projects.service';
// import { UsersService } from '../../user/users.service';
// import { CreateProjectDto } from './dto/create-project.dto';
// import { UpdateProjectDto } from './dto/update-project.dto';
// import { Project } from './entities/project.entity';
// import { ForbiddenException } from '@nestjs/common';
// import { Status } from '../../enums/role.enum';

// describe('ProjectsController', () => {
//   let controller: ProjectsController;
//   let projectsService: ProjectsService;
//   let usersService: UsersService;

//   const mockProjectsService = {
//     create: jest.fn(),
//     findAll: jest.fn(),
//     update: jest.fn(),
//     remove: jest.fn(),
//   };

//   const mockUsersService = {
//     checkUserRole: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ProjectsController],
//       providers: [
//         { provide: ProjectsService, useValue: mockProjectsService },
//         { provide: UsersService, useValue: mockUsersService },
//       ],
//     }).compile();

//     controller = module.get<ProjectsController>(ProjectsController);
//     projectsService = module.get<ProjectsService>(ProjectsService);
//     usersService = module.get<UsersService>(UsersService);
//   });

//   describe('create', () => {
//     it('should successfully create a project when user is an instructor', async () => {
//       const createProjectDto: CreateProjectDto = {
//         title: 'New Project',
//         team_name: 'Team Alpha',
//         status: Status.IN_PROGRESS,  // Use enum value
//         userId: 1,
//       };

//       const mockProject: Project = {
//         project_id: 1,
//         title: 'New Project',
//         team_name: 'Team Alpha',
//         status: Status.IN_PROGRESS,  // Use enum value
//         users: [],
//         project_docs: [],
//       };

//       jest.spyOn(usersService, 'checkUserRole').mockResolvedValue(true);
//       jest.spyOn(projectsService, 'create').mockResolvedValue(mockProject);

//       const result = await controller.create(createProjectDto);

//       expect(result).toEqual({
//         message: "프로젝트를 생성했습니다",
//         data: mockProject,
//       });
//     });

//     it('should throw ForbiddenException when user is not an instructor', async () => {
//       const createProjectDto: CreateProjectDto = {
//         title: 'New Project',
//         team_name: 'Team Alpha',
//         status: Status.IN_PROGRESS,  // Use enum value
//         userId: 1,
//       };

//       jest.spyOn(usersService, 'checkUserRole').mockResolvedValue(false);

//       await expect(controller.create(createProjectDto)).rejects.toThrow(ForbiddenException);
//     });
//   });

//   describe('findAll', () => {
//     it('should return an array of projects', async () => {
//       const mockProjects: Project[] = [
//         {
//           project_id: 1,
//           title: 'Project 1',
//           team_name: 'Team One',
//           status: Status.IN_PROGRESS,  // Use enum value
//           users: [],
//           project_docs: [],
//         },
//         {
//           project_id: 2,
//           title: 'Project 2',
//           team_name: 'Team Two',
//           status: Status.COMPLETED,  // Use enum value
//           users: [],
//           project_docs: [],
//         },
//       ];

//       jest.spyOn(projectsService, 'findAll').mockResolvedValue(mockProjects);

//       const result = await controller.findAll();

//       expect(result).toEqual(mockProjects);
//     });
//   });

//   describe('update', () => {
//     it('should successfully update a project', async () => {
//       const updateProjectDto: Partial<UpdateProjectDto> = {
//         title: 'Updated Project Title',
//       };

//       const updatedProject: Project = {
//         project_id: 1,
//         title: 'Updated Project Title',
//         team_name: 'Team Alpha',
//         status: Status.IN_PROGRESS,  // Use enum value
//         users: [],
//         project_docs: [],
//       };

//       jest.spyOn(projectsService, 'update').mockResolvedValue(updatedProject);

//       const result = await controller.update(1, updateProjectDto);

//       expect(result).toEqual({
//         message: "프로젝트가 수정되었습니다",
//         modification: updatedProject,
//       });
//     });
//   });

//   describe('remove', () => {
//     it('should successfully remove a project', async () => {
//       jest.spyOn(projectsService, 'remove').mockResolvedValue(undefined);

//       await expect(controller.remove(1)).resolves.not.toThrow();
//     });
//   });
// });
