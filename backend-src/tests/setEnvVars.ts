import 'dotenv/config'
// const envVars = dotenv.config({ path: process.cwd() + '/.env' }).parsed as any
if (
	!process.env.DB_HOST ||
	!process.env.DB_USER ||
	!process.env.DB_PASSWORD === undefined ||
	!process.env.DB_DB ||
	!process.env.DB_DIALECT ||
	!process.env.DB_PORT
)
	throw new Error('.env.ci DB not specified')
