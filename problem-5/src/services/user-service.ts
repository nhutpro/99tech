import { User } from '@prisma/client';
import redisClient from '../config/redis';
import logger from '../utils/logger';
import prisma from '../config/prisma';

interface CreateUserInput {
  name: string;
  email: string;
  gender?: string;
  role?: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  gender?: string;
  role?: string;
}

interface UserFilters {
  gender?: string;
  role?: string;
  search?: string;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

class UserService {
  private readonly CACHE_PREFIX = 'user:';
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly USERS_LIST_CACHE_KEY = 'users:list';

  async createUser(userData: CreateUserInput): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: userData,
      });

      logger.info(`User created with ID: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const cachedUser = await this.getCachedUser(id);
      if (cachedUser) {
        logger.info(`User ${id} retrieved from cache`);
        return cachedUser;
      }

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (user) {
        await this.cacheUser(user);
        logger.info(`User ${id} retrieved from database and cached`);
      }

      return user;
    } catch (error) {
      logger.error(`Error getting user by ID ${id}:`, error);
      throw error;
    }
  }

  async getUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      // Build where clause for filters
      const where: any = {};

      if (filters.gender) {
        where.gender = filters.gender;
      }

      if (filters.role) {
        where.role = filters.role;
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
      const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const result = {
        users,
        total,
        page,
        limit,
      };

      logger.info('Users list retrieved from database');

      return result;
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: UpdateUserInput): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: userData,
      });

      await this.removeCachedUser(id);

      logger.info(`User ${id} updated`);
      return user;
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });

      await this.removeCachedUser(id);

      logger.info(`User ${id} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  private async cacheUser(user: User): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${user.id}`;
      await redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(user));
    } catch (error) {
      logger.error('Error caching user:', error);
    }
  }

  private async getCachedUser(id: number): Promise<User | null> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${id}`;
      const cachedUser = await redisClient.get(cacheKey);
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch (error) {
      logger.error('Error getting cached user:', error);
      return null;
    }
  }

  private async removeCachedUser(id: number): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${id}`;
      await redisClient.del(cacheKey);
    } catch (error) {
      logger.error('Error removing cached user:', error);
    }
  }

}

export default new UserService();
