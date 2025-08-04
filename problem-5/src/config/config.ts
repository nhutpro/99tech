import dotenv from 'dotenv';
import {StringValue} from 'ms'

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  pageSizeDefault: number;
  pageNumberDefault: number;
  databaseUrl: string;
  jwtRefreshSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  pageSizeDefault: Number(process.env.PAGE_SIZE_DEFAULT) || 20,
  pageNumberDefault: Number(process.env.PAGE_NUMBER_DEFAULT) || 1,
  databaseUrl: process.env.DATABASE_URL || 'default_database_url',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
};

export default config;