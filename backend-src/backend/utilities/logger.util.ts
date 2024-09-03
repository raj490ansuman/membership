import moment from 'moment'
import path from 'path'
import { transports, createLogger, format } from 'winston'
import { systemConfig } from '../config/index'
const nowDate = moment().format('_YYYY_MM')
const levelFilter = (level: logLevelType) => format((info) => (info.level == level ? info : false))()

export const logger = createLogger({
	levels: {
		crit: 2,
		error: 3,
		info: 6,
		debug: 7
	},
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [
		new transports.File({
			format: levelFilter('crit'),
			filename: path.join(systemConfig.PATH_LOG, `system_crit${nowDate}.log`),
			level: 'crit'
		}),
		new transports.File({
			format: levelFilter('error'),
			filename: path.join(systemConfig.PATH_LOG, `system_error${nowDate}.log`),
			level: 'error'
		}),
		new transports.File({
			format: levelFilter('info'),
			filename: path.join(systemConfig.PATH_LOG, `system_info${nowDate}.log`),
			level: 'info'
		}),
		new transports.File({
			format: levelFilter('debug'),
			filename: path.join(systemConfig.PATH_LOG, `system_debug${nowDate}.log`),
			level: 'debug'
		})
	],
	exceptionHandlers: [
		new transports.File({ filename: path.join(systemConfig.PATH_LOG, `exceptions${nowDate}.log`) })
	],
	rejectionHandlers: [new transports.File({ filename: path.join(systemConfig.PATH_LOG, `rejections${nowDate}.log`) })]
})

if (systemConfig.isDevelopment) {
	logger.add(
		new transports.Console({
			format: format.combine(format.colorize(), format.simple())
		})
	)
}
// type logLevelType = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug'
type logLevelType = 'crit' | 'error' | 'info' | 'debug'

export const writeLog = (msg: string | object, logLevel: logLevelType) => {
	if (systemConfig.CONSOLE_ONLY) {
		// eslint-disable-next-line no-console
		console.warn(msg, logLevel)
	} else if (!logLevel) {
		return
	} else {
		logger.log(logLevel, msg)
	}
}
