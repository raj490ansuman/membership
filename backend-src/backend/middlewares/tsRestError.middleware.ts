import { ResponseValidationError } from '@ts-rest/core'
import { ErrorRequestHandler } from 'express'
import { logger } from '../utilities'
import { systemConfig } from '../config'

const globalError = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	err: any,
	requestId: string
): [string, number] | null => {
	if (err.isOperational) {
		return [err.message, err.httpCode]
	}

	if (err instanceof ResponseValidationError) {
		logger.error(`route: ${err.appRoute.method} ${err.appRoute.path} ${err.message.toString()}`, {
			requestId
		})
		return ['Something went wrong!', 500]
	}

	if (err.type === 'entity.parse.failed') {
		return ['Invalid JSON data', 400]
	}

	return null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleGlobalError: ErrorRequestHandler = (err, _req, res, _next) => {
	const errorResponse = globalError(err, res.locals.reqId)

	// If we have a custom message, status and statusCode from globalError
	if (errorResponse) {
		const [message, status] = errorResponse
		return res.status(status).json({
			success: false,
			message
		})
	}

	switch (systemConfig.NODE_ENV) {
		case 'development':
			logger.error('devErrorHandler', {
				requestId: res.locals.reqId,
				error: err,
				stack: err.stack
			})
			return res.status(err.statusCode || 500).json({
				development: true,
				status: 'error',
				message: err.message,
				stack: err.stack,
				success: false
			})

		case 'production':
			logger.error('prodErrorHandler', {
				requestId: res.locals.reqId,
				error: err,
				stack: err.stack,
				success: false
			})
			return res.status(err.statusCode || 500).json({
				production: true,
				status: 'error',
				message: 'Something went wrong!',
				success: false
			})

		default:
			return res.status(err.statusCode || 500).json({
				status: 'error',
				message: 'Something went wrong!',
				success: false
			})
	}
}

export { handleGlobalError }
