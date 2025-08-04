import { Request, Response } from 'express';
import userService from '../services/user-service';
import logger from '../utils/logger';
import { validateCreateUser, validateQueryParams, validateUpdateUser } from '../utils/validation';

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateCreateUser(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error'
        });
        return;
      }

      const user = await userService.createUser(value);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error: any) {
      logger.error('Error in createUser controller:', error);

      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        res.status(409).json({
          success: false,
          message: 'Email already exists',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = validateQueryParams(req.query);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error'
        });
        return;
      }

      const { page, limit, gender, role, search } = value;

      const filters = { gender, role, search };
      const pagination = { page, limit };

      const result = await userService.getUsers(filters, pagination);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.users,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      logger.error('Error in getUsers controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
        return;
      }

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      logger.error('Error in getUserById controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
        return;
      }

      const { error, value } = validateUpdateUser(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error'
        });
        return;
      }

      const user = await userService.updateUser(id, value);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error: any) {
      logger.error('Error in updateUser controller:', error);

      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        res.status(409).json({
          success: false,
          message: 'Email already exists',
        });
        return;
      }

      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID',
        });
        return;
      }

      const success = await userService.deleteUser(id);

      if (!success) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      logger.error('Error in deleteUser controller:', error);

      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

export default new UserController();
