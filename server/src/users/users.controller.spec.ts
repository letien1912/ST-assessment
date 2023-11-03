import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { IUserPagination } from './users.interface';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockUsersService = {
      find: jest.fn(),
      processCsvFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('getUsers', () => {
    it('should get users with pagination', async () => {
      const search = 'test';
      const skip = '0';
      const take = '10';
      const result: IUserPagination = {
        count: 1,
        data: [
          {
            id: 1,
            postId: 1,
            name: 'string',
            email: 'string',
            body: 'string',
          },
        ],
      };

      usersService.find.mockResolvedValue(result);

      expect(await usersController.getUsers(search, skip, take)).toBe(result);
      expect(usersService.find).toHaveBeenCalledWith(
        search,
        Number(skip),
        Number(take),
      );
    });

    it('should throw error for invalid skip value', () => {
      expect(async () => {
        await usersController.getUsers('', 'abc', '10');
      }).rejects.toEqual(new BadRequestException('skip must be a number'));
    });

    it('should throw error for invalid take value', () => {
      expect(async () => {
        await usersController.getUsers('', '0', 'abc');
      }).rejects.toEqual(new BadRequestException('take must be a number'));
    });
  });

  describe('uploadFile', () => {
    it('should upload and process a file', async () => {
      const mockFile = { path: 'file.csv', mimetype: 'text/csv' };
      usersService.processCsvFile.mockResolvedValue(undefined);

      const result = await usersController.uploadFile(mockFile);

      expect(result).toEqual({ path: mockFile.path });
      expect(usersService.processCsvFile).toHaveBeenCalledWith(mockFile.path);
    });

    it('should throw error if no file is provided', async () => {
      await expect(usersController.uploadFile(undefined)).rejects.toThrow(
        'file is not provided',
      );
    });

    it('should throw error for unsupported file types', async () => {
      const mockFile = { path: 'file.png' };
      await expect(usersController.uploadFile(mockFile)).rejects.toThrow(
        'Not CSV file',
      );
    });
  });
});
