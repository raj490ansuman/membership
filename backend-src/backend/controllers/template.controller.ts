import { NextFunction, Request, Response } from 'express'
import { RESPONSE_SUCCESS, SYSTEM_ERROR } from '../config'
import { AppError, SocketUtil } from '../utilities'
import { TemplateService } from '../services'

export const createTemplate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, contents, description } = req.body
		if (!(name || contents || description)) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		}
		const template = await TemplateService.createTemplate({
			name: name,
			contents: contents,
			description: description
		})
		SocketUtil.emitTemplate({ name })
		res.send(template)
	} catch (e) {
		next(e)
	}
}

export const browseTemplates = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const searchParams = req.query
		await TemplateService.browseTemplates(searchParams).then((templates) => res.send(templates))
	} catch (e) {
		next(e)
	}
}

export const getTemplate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const templateId = parseInt(req.params.templateId)
		if (!templateId) {
			throw new AppError(SYSTEM_ERROR, 'invalid templateId', false)
		}
		await TemplateService.getTemplate(templateId).then((template) => res.send(template))
	} catch (e) {
		next(e)
	}
}

export const updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const templateId = parseInt(req.params.templateId)
		const updateParams = {
			name: req.body.name,
			contents: req.body.contents,
			description: req.body.description
		}
		if (!templateId || !(updateParams.name || updateParams.contents || updateParams.description)) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters', false)
		}
		const template = await TemplateService.updateTemplate({ templateId, ...updateParams })
		SocketUtil.emitTemplate({ name: template.name })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}

export const deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const templateId = parseInt(req.params.templateId)
		if (templateId) {
			throw new AppError(SYSTEM_ERROR, 'invalid templateId', false)
		}
		const template = await TemplateService.deleteTemplate(templateId)
		SocketUtil.emitTemplate({ name: template.name })
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}
