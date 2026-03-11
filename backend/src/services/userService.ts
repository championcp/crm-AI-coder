/**
 * 用户服务层
 * 企业项目全流程管理数据系统 - 用户管理服务
 */

import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';

const userRepository = () => AppDataSource.getRepository(User);

/**
 * 创建用户
 */
export async function createUser(userData: {
  username: string;
  password: string;
  realName: string;
  phone?: string;
  email?: string;
  role?: string;
  department?: string;
}): Promise<User> {
  // 检查用户名是否已存在
  const existingUser = await userRepository().findOne({ where: { username: userData.username } });
  if (existingUser) {
    throw new Error('用户名已存在');
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = userRepository().create({
    username: userData.username,
    password: hashedPassword,
    realName: userData.realName,
    phone: userData.phone || '',
    email: userData.email || '',
    role: userData.role || UserRole.SALES_MANAGER,
    department: userData.department || '销售部',
    status: UserStatus.ACTIVE
  });

  return await userRepository().save(user);
}

/**
 * 更新用户
 */
export async function updateUser(
  userId: string,
  updateData: Partial<User>
): Promise<User> {
  const user = await userRepository().findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('用户不存在');
  }

  // 不能修改用户名
  const { username, ...updateFields } = updateData;

  Object.assign(user, updateFields);
  return await userRepository().save(user);
}

/**
 * 删除用户
 */
export async function deleteUser(userId: string): Promise<void> {
  const user = await userRepository().findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('用户不存在');
  }

  await userRepository().remove(user);
}

/**
 * 修改用户密码
 */
export async function changeUserPassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const user = await userRepository().findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('用户不存在');
  }

  // 验证旧密码
  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) {
    throw new Error('旧密码不正确');
  }

  // 加密新密码
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await userRepository().save(user);
}

/**
 * 重置用户密码（管理员功能）
 */
export async function resetUserPassword(
  userId: string,
  newPassword: string
): Promise<void> {
  const user = await userRepository().findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('用户不存在');
  }

  // 加密新密码
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await userRepository().save(user);
}

/**
 * 切换用户状态
 */
export async function toggleUserStatus(userId: string): Promise<User> {
  const user = await userRepository().findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('用户不存在');
  }

  user.status = user.status === UserStatus.ACTIVE ? UserStatus.DISABLED : UserStatus.ACTIVE;
  return await userRepository().save(user);
}

/**
 * 获取用户列表
 */
export async function getUserList(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  role?: string;
  department?: string;
  status?: string;
}): Promise<{ list: User[]; total: number }> {
  const { page = 1, pageSize = 10, keyword, role, department, status } = params;
  const skip = (page - 1) * pageSize;

  const queryBuilder = userRepository().createQueryBuilder('user');

  if (keyword) {
    queryBuilder.andWhere('(user.username LIKE :keyword OR user.realName LIKE :keyword OR user.email LIKE :keyword)', {
      keyword: `%${keyword}%`
    });
  }

  if (role) {
    queryBuilder.andWhere('user.role = :role', { role });
  }

  if (department) {
    queryBuilder.andWhere('user.department = :department', { department });
  }

  if (status) {
    queryBuilder.andWhere('user.status = :status', { status });
  }

  const [users, total] = await queryBuilder
    .orderBy('user.createTime', 'DESC')
    .skip(skip)
    .take(pageSize)
    .getManyAndCount();

  // 移除密码字段
  const sanitizedUsers = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return { list: sanitizedUsers as User[], total };
}

/**
 * 根据ID获取用户
 */
export async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository().findOne({ where: { id: userId } });
  if (user) {
    // 移除密码字段
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

/**
 * 获取角色选项列表
 */
export function getRoleOptions(): { value: string; label: string }[] {
  return Object.values(UserRole).map(role => ({
    value: role,
    label: getRoleLabel(role)
  }));
}

/**
 * 获取角色标签
 */
function getRoleLabel(role: UserRole): string {
  const roleLabels: Record<UserRole, string> = {
    [UserRole.SYSTEM_ADMIN]: '系统管理员',
    [UserRole.SALES_MANAGER]: '销售经理',
    [UserRole.SALES_CONTROLLER]: '销售管控',
    [UserRole.DELIVERY_MANAGER]: '交付经理',
    [UserRole.DEVELOPER]: '开发工程师',
    [UserRole.PROJECT_MANAGER]: '项目经理',
    [UserRole.PROJECT_CONTROLLER]: '项目管控',
    [UserRole.OPERATIONS_SUPERVISOR]: '运营主管',
    [UserRole.PROJECT_OPERATIONS]: '项目运营管控',
    [UserRole.FINANCE_ACCOUNTANT]: '财务会计',
    [UserRole.DEPARTMENT_HEAD]: '部门负责人',
    [UserRole.SENIOR_MANAGEMENT]: '高层管理人员'
  };
  return roleLabels[role] || role;
}

/**
 * 获取部门选项列表
 */
export function getDepartmentOptions(): { value: string; label: string }[] {
  const departments = [
    '销售部',
    '售前部',
    '交付部',
    '开发部',
    '管控部',
    '运营部',
    '财务部',
    '信息化部'
  ];

  return departments.map(dept => ({ value: dept, label: dept }));
}