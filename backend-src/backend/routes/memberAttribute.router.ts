import { initServer } from '@ts-rest/express'
import { ContractAPI } from '../../contracts'
import { MemberAttributeController } from '../controllers'

const s = initServer()

export const MemberAttributeRouter = s.router(ContractAPI.memberAttributes, {
	listMemberAttributes: {
		handler: MemberAttributeController.listMemberAttributes
	},
	createMemberAttribute: {
		handler: MemberAttributeController.createMemberAttribute
	},
	updateMemberAttributeOrder: {
		handler: MemberAttributeController.updateMemberAttributeOrder
	},
	updateMemberAttribute: {
		handler: MemberAttributeController.updateMemberAttribute
	},
	deleteMemberAttribute: {
		handler: MemberAttributeController.deleteMemberAttribute
	}
})
