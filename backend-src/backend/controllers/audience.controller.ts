import { NextFunction, Request, Response } from 'express'
import { RESPONSE_SUCCESS, SYSTEM_ERROR } from '../config'
import { AppError, SocketUtil } from '../utilities'
import { AudienceService } from '../services'

export const listAudiences = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const audiences = await AudienceService.listAudiences()
		res.send(audiences)
	} catch (e) {
		next(e)
	}
}

export const searchAudience = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const searchParams = req.body
		const result = await AudienceService.searchAudience(searchParams)
		res.send(result)
	} catch (e) {
		next(e)
	}
}

export const createAudience = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.body.audienceName) {
			throw new AppError(SYSTEM_ERROR, 'invalid parameters')
		}
		await AudienceService.createAudience(req.body)
		console.log(req.body);
		
		res.sendStatus(RESPONSE_SUCCESS)
	} catch (e) {
		next(e)
	}
}

export const deleteAudience = async (req: Request, res: Response, next: NextFunction) => {
	const audienceGroupId = req.params.audienceGroupId
	try {
		if (audienceGroupId == null) {
			throw new Error('invalid audienceGroupId')
		} else {
			await AudienceService.deleteAudience(audienceGroupId)
			SocketUtil.emitAudience({ audienceGroupId })
			res.sendStatus(RESPONSE_SUCCESS)
		}
	} catch (e) {
		next(e)
	}
}


// import { AppRouteOptions } from '@ts-rest/express';
// import { RESPONSE_SUCCESS, SYSTEM_ERROR } from '../config';
// // import { db } from '../models';
// import { AudienceService } from '../services';
// import { AppError, SocketUtil } from '../utilities';
// import { ContractAPI } from '../../contracts'
// import { zAudience } from '../../schemas'
// import { Request, Response, NextFunction } from 'express'

// // Handler to list audiences
// export const listAudiences: AppRouteOptions<
//   typeof ContractAPI.audiences.listAudiences
// >['handler'] = async () => {
//   const audiences = await AudienceService.listAudiences();
//   const sanitizedAudiences = zAudience.array().parse(audiences);

//   return {
//     status: RESPONSE_SUCCESS,
//     body: {
//       data: sanitizedAudiences,
//       message: 'Successfully retrieved audiences',
//       success: true
//     }
//   };
// };

// // Handler to search for audiences
// export const searchAudience: AppRouteOptions<
//   typeof ContractAPI.audiences.searchAudience
// >['handler'] = async ({ body }) => {
// 	try {
// 		const result = await AudienceService.searchAudience(body);
// 		return { status: RESPONSE_SUCCESS, body: result };
// 	  } catch (error) {
// 		return { status: 500, body: { message: 'Failed to search audience' } };
// 	  }
// };

// // Handler to create a new audience
// export const createAudience: AppRouteOptions<
//   typeof ContractAPI.audiences.createAudience
// >['handler'] = async ( { body }) => {

//   try {
// 	if (!body.description) {
// 	  throw new AppError(SYSTEM_ERROR, 'Invalid parameters');
// 	}
// 	await AudienceService.createAudience({audienceName: body.description});
// 	return { status: RESPONSE_SUCCESS, body: { message: 'Audience created successfully', success: true } };
//   } catch (error) {
// 	return { status: 500, body: { message: 'Failed to create audience' } };
//   }
// };

// // Handler to delete an audience
// export const deleteAudience: AppRouteOptions<
//   typeof ContractAPI.audiences.deleteAudience
// >['handler'] = async ({ params }) => {
// 	const audienceGroupId  = params.audienceGroupId;
//     try {
//       if (!audienceGroupId) {
//         return { status: 400, body: { message: 'Invalid audienceGroupId' } };
//       }
//       await AudienceService.deleteAudience(audienceGroupId);
//       SocketUtil.emitAudience({ audienceGroupId });
//       return { status: RESPONSE_SUCCESS, body: { message: 'Audience deleted successfully', success: true  } };
//     } catch (error) {
//       return { status: 500, body: { message: 'Failed to delete audience' } };
//     }
// };


