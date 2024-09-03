import { dbConfig } from '../../../config'
import type { Config } from 'sequelize'
export default {
	development: {
		username: dbConfig.USER,
		password: dbConfig.PASSWORD,
		database: dbConfig.DB,
		host: dbConfig.HOST,
		dialect: dbConfig.DIALECT,
		pool: dbConfig.POOL,
		timezone: '+09:00'
	},
	test: {
		username: dbConfig.USER,
		password: dbConfig.PASSWORD,
		database: dbConfig.DB,
		host: dbConfig.HOST,
		dialect: dbConfig.DIALECT,
		pool: dbConfig.POOL,
		timezone: '+09:00'
	},
	production: {
		username: dbConfig.USER,
		password: dbConfig.PASSWORD,
		database: dbConfig.DB,
		host: dbConfig.HOST,
		dialect: dbConfig.DIALECT,
		pool: dbConfig.POOL,
		timezone: '+09:00'
	}
} as Record<'development' | 'test' | 'production', Pick<Config, 'username' | 'password' | 'database' | 'host' | 'pool'>>
