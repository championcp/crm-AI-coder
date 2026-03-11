/**
 * 用户服务测试
 * 企业项目全流程管理数据系统 - 用户管理服务测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { User, UserRole, UserStatus } from '../../entities/User';
import * as userService from '../userService';

describe('UserService', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    // 初始化数据库连接
    dataSource = AppDataSource;
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    // 清空用户表
    const userRepository = dataSource.getRepository(User);
    await userRepository.clear();
  });

  afterEach(async () => {
    // 测试结束后不需要特殊处理
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        realName: '测试用户',
        phone: '13800138000',
        email: 'test@example.com',
        role: UserRole.SALES_MANAGER,
        department: '销售部'
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.realName).toBe(userData.realName);
      expect(user.phone).toBe(userData.phone);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.department).toBe(userData.department);
      expect(user.status).toBe(UserStatus.ACTIVE);
      // 密码应该被加密，不应该与原始密码相同
      expect(user.password).not.toBe(userData.password);
    });

    it('should throw error when username already exists', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        realName: '测试用户'
      };

      // 先创建一个用户
      await userService.createUser(userData);

      // 尝试创建同名用户应该抛出错误
      await expect(userService.createUser(userData)).rejects.toThrow('用户名已存在');
    });
  });

  describe('updateUser', () => {
    it('should update user information', async () => {
      // 先创建用户
      const userData = {
        username: 'testuser',
        password: 'password123',
        realName: '测试用户'
      };
      const createdUser = await userService.createUser(userData);

      // 更新用户信息
      const updateData = {
        realName: '更新后的用户',
        phone: '13900139000',
        email: 'updated@example.com'
      };

      const updatedUser = await userService.updateUser(createdUser.id, updateData);

      expect(updatedUser.realName).toBe(updateData.realName);
      expect(updatedUser.phone).toBe(updateData.phone);
      expect(updatedUser.email).toBe(updateData.email);
      // 用户名不应该被更新
      expect(updatedUser.username).toBe(userData.username);
    });

    it('should throw error when user not found', async () => {
      const updateData = {
        realName: '更新后的用户'
      };

      await expect(userService.updateUser('non-existent-id', updateData))
        .rejects.toThrow('用户不存在');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      // 先创建用户
      const userData = {
        username: 'testuser',
        password: 'password123',
        realName: '测试用户'
      };
      const createdUser = await userService.createUser(userData);

      // 删除用户
      await userService.deleteUser(createdUser.id);

      // 验证用户已被删除
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: createdUser.id } });
      expect(user).toBeNull();
    });

    it('should throw error when user not found', async () => {
      await expect(userService.deleteUser('non-existent-id'))
        .rejects.toThrow('用户不存在');
    });
  });

  describe('changeUserPassword', () => {
    it('should change user password', async () => {
      // 先创建用户
      const userData = {
        username: 'testuser',
        password: 'oldpassword',
        realName: '测试用户'
      };
      const createdUser = await userService.createUser(userData);

      // 修改密码
      const newPassword = 'newpassword';
      await userService.changeUserPassword(createdUser.id, 'oldpassword', newPassword);

      // 验证密码已更新
      const userRepository = dataSource.getRepository(User);
      const updatedUser = await userRepository.findOne({ where: { id: createdUser.id } });
      expect(updatedUser).toBeDefined();
      expect(updatedUser!.password).not.toBe(userData.password);
    });

    it('should throw error when old password is incorrect', async () => {
      // 先创建用户
      const userData = {
        username: 'testuser',
        password: 'oldpassword',
        realName: '测试用户'
      };
      const createdUser = await userService.createUser(userData);

      // 使用错误的旧密码尝试修改密码
      await expect(userService.changeUserPassword(createdUser.id, 'wrongpassword', 'newpassword'))
        .rejects.toThrow('旧密码不正确');
    });
  });

  describe('toggleUserStatus', () => {
    it('should toggle user status', async () => {
      // 先创建用户
      const userData = {
        username: 'testuser',
        password: 'password123',
        realName: '测试用户'
      };
      const createdUser = await userService.createUser(userData);

      // 切换状态
      const toggledUser = await userService.toggleUserStatus(createdUser.id);
      expect(toggledUser.status).toBe(UserStatus.DISABLED);

      // 再次切换状态
      const toggledUser2 = await userService.toggleUserStatus(createdUser.id);
      expect(toggledUser2.status).toBe(UserStatus.ACTIVE);
    });

    it('should throw error when user not found', async () => {
      await expect(userService.toggleUserStatus('non-existent-id'))
        .rejects.toThrow('用户不存在');
    });
  });

  describe('getUserList', () => {
    it('should get user list with pagination', async () => {
      // 创建多个用户
      for (let i = 1; i <= 5; i++) {
        await userService.createUser({
          username: `user${i}`,
          password: 'password123',
          realName: `用户${i}`
        });
      }

      // 获取用户列表
      const result = await userService.getUserList({
        page: 1,
        pageSize: 3
      });

      expect(result.list).toHaveLength(3);
      expect(result.total).toBe(5);
    });

    it('should filter users by keyword', async () => {
      // 创建测试用户
      await userService.createUser({
        username: 'alice',
        password: 'password123',
        realName: '爱丽丝'
      });

      await userService.createUser({
        username: 'bob',
        password: 'password123',
        realName: '鲍勃'
      });

      // 按关键字搜索
      const result = await userService.getUserList({
        keyword: 'alice'
      });

      expect(result.list).toHaveLength(1);
      expect(result.list[0].username).toBe('alice');
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      // 先创建用户
      const userData = {
        username: 'testuser',
        password: 'password123',
        realName: '测试用户'
      };
      const createdUser = await userService.createUser(userData);

      // 根据ID获取用户
      const user = await userService.getUserById(createdUser.id);

      expect(user).toBeDefined();
      expect(user!.username).toBe(userData.username);
      expect(user!.realName).toBe(userData.realName);
    });

    it('should return null when user not found', async () => {
      const user = await userService.getUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });
});