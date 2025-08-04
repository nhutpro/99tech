import Joi from 'joi';

// Schema for creating a new user
const createUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 100 characters',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
        }),

    gender: Joi.string()
        .valid('male', 'female', 'other')
        .optional()
        .messages({
            'any.only': 'Gender must be one of: male, female, other',
        }),

    role: Joi.string()
        .valid('user', 'admin', 'moderator')
        .optional()
        .messages({
            'any.only': 'Role must be one of: user, admin, moderator',
        }),
});

// Schema for updating a user (all fields optional)
const updateUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 100 characters',
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Please provide a valid email address',
        }),

    gender: Joi.string()
        .valid('male', 'female', 'other')
        .optional()
        .messages({
            'any.only': 'Gender must be one of: male, female, other',
        }),

    role: Joi.string()
        .valid('user', 'admin', 'moderator')
        .optional()
        .messages({
            'any.only': 'Role must be one of: user, admin, moderator',
        }),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

// Schema for query parameters (filtering and pagination)
const queryParamsSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .optional()
        .messages({
            'number.integer': 'Page must be a valid integer',
            'number.min': 'Page must be at least 1',
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .optional()
        .messages({
            'number.integer': 'Limit must be a valid integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit must not exceed 100',
        }),

    gender: Joi.string()
        .valid('male', 'female', 'other')
        .optional()
        .messages({
            'any.only': 'Gender filter must be one of: male, female, other',
        }),

    role: Joi.string()
        .valid('user', 'admin', 'moderator')
        .optional()
        .messages({
            'any.only': 'Role filter must be one of: user, admin, moderator',
        }),

    search: Joi.string()
        .min(1)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Search term must be at least 1 character long',
            'string.max': 'Search term must not exceed 100 characters',
        }),
});

// Validation functions
export const validateCreateUser = (data: any) => {
    return createUserSchema.validate(data, { abortEarly: false });
};

export const validateUpdateUser = (data: any) => {
    return updateUserSchema.validate(data, { abortEarly: false });
};

export const validateQueryParams = (data: any) => {
    return queryParamsSchema.validate(data, { abortEarly: false });
};

// Type definitions for better TypeScript support
export interface CreateUserData {
    name: string;
    email: string;
    gender?: 'male' | 'female' | 'other';
    role?: 'user' | 'admin' | 'moderator';
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    gender?: 'male' | 'female' | 'other';
    role?: 'user' | 'admin' | 'moderator';
}

export interface QueryParams {
    page?: number;
    limit?: number;
    gender?: 'male' | 'female' | 'other';
    role?: 'user' | 'admin' | 'moderator';
    search?: string;
}
