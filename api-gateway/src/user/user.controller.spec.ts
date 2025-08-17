import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { of } from 'rxjs';

describe('UserController', () => {
  let controller: UserController;
  let userClient: ClientProxy;

  // Mock ClientProxy
  const mockUserClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: mockUserClient,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userClient = module.get<ClientProxy>('USER_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addUser', () => {
    it('should add a user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        // Add other properties as per your DTO
      };
      const expectedResponse = {
        id: '1',
        email: 'test@example.com',
        message: 'User created successfully',
      };

      mockUserClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.addUser(createUserDto);

      // Assert
      expect(mockUserClient.send).toHaveBeenCalledWith(
        { cmd: 'add_user' },
        createUserDto,
      );
      expect(mockUserClient.send).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle error when adding user fails', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const errorResponse = { error: 'User already exists' };

      mockUserClient.send.mockReturnValue(of(errorResponse));

      // Act
      const result = await controller.addUser(createUserDto);

      // Assert
      expect(result).toEqual(errorResponse);
    });
  });

  describe('doLogin', () => {
    it('should login user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResponse = {
        accessToken: 'jwt-token',
        user: { id: '1', email: 'test@example.com' },
      };

      mockUserClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.doLogin(createUserDto);

      // Assert
      expect(mockUserClient.send).toHaveBeenCalledWith(
        { cmd: 'login_user' },
        { email: createUserDto.email, password: createUserDto.password },
      );
      expect(mockUserClient.send).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid credentials', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const errorResponse = { error: 'Invalid credentials' };

      mockUserClient.send.mockReturnValue(of(errorResponse));

      // Act
      const result = await controller.doLogin(createUserDto);

      // Assert
      expect(result).toEqual(errorResponse);
    });

    it('should extract only email and password from DTO', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        extraField: 'should not be passed',
      } as CreateUserDto;

      mockUserClient.send.mockReturnValue(of({}));

      // Act
      await controller.doLogin(createUserDto);

      // Assert
      expect(mockUserClient.send).toHaveBeenCalledWith(
        { cmd: 'login_user' },
        { 
          email: createUserDto.email, 
          password: createUserDto.password 
        },
      );
    });
  });

  describe('getUsers', () => {
    it('should get all users successfully', async () => {
      // Arrange
      const expectedResponse = {
        users: [
          { id: '1', email: 'user1@example.com' },
          { id: '2', email: 'user2@example.com' },
        ],
      };

      mockUserClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.getUsers();

      // Assert
      expect(mockUserClient.send).toHaveBeenCalledWith(
        { cmd: 'get_users' },
        {},
      );
      expect(mockUserClient.send).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle empty user list', async () => {
      // Arrange
      const expectedResponse = { users: [] };

      mockUserClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.getUsers();

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateRole', () => {
    it('should update user role successfully', async () => {
      // Arrange
      const userId = '123';
      const newRole = 'admin';
      const expectedResponse = {
        id: userId,
        role: newRole,
        message: 'Role updated successfully',
      };

      mockUserClient.send.mockReturnValue(of(expectedResponse));

      // Act
      const result = await controller.updateRole(userId, newRole);

      // Assert
      expect(mockUserClient.send).toHaveBeenCalledWith(
        { cmd: 'update_rolePermissions' },
        { id: userId, role: newRole },
      );
      expect(mockUserClient.send).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle user not found error', async () => {
      // Arrange
      const userId = 'nonexistent';
      const newRole = 'admin';
      const errorResponse = { error: 'User not found' };

      mockUserClient.send.mockReturnValue(of(errorResponse));

      // Act
      const result = await controller.updateRole(userId, newRole);

      // Assert
      expect(result).toEqual(errorResponse);
    });

    it('should handle invalid role error', async () => {
      // Arrange
      const userId = '123';
      const invalidRole = 'invalid_role';
      const errorResponse = { error: 'Invalid role specified' };

      mockUserClient.send.mockReturnValue(of(errorResponse));

      // Act
      const result = await controller.updateRole(userId, invalidRole);

      // Assert
      expect(result).toEqual(errorResponse);
    });

    it('should pass parameters correctly', async () => {
      // Arrange
      const userId = '456';
      const role = 'moderator';

      mockUserClient.send.mockReturnValue(of({}));

      // Act
      await controller.updateRole(userId, role);

      // Assert
      expect(mockUserClient.send).toHaveBeenCalledWith(
        { cmd: 'update_rolePermissions' },
        { id: userId, role: role },
      );
    });
  });
});