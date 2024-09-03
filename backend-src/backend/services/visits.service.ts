import { Op, Transaction } from 'sequelize'
import { db } from '../models'
import { Member } from '../models/member.model'
import { AppError } from '../utilities'
import { CONFLICT_ERROR, SYSTEM_ERROR } from '../config'
import { MemberVisit } from '../models/memberVisit.model'

/**
 * Return unique day visiting count of member visits by aggregating same-day visits into 1
 * @param visits
 * @returns
 */
export const countUniqueDayMemberVisits = (visits: MemberVisit[] | undefined): number => {
	// Initialize with first visit
	let countVisit = visits && visits?.length > 0 ? 1 : 0

	// Short-circuit
	if (!visits || !visits.length) return countVisit

	// Aggregate same-day visits as 1 by looking at all other-day visits beyond first visit
	visits.reduce((prevVisit, currVisit) => {
		if (prevVisit.visitDate.toDateString() !== currVisit.visitDate.toDateString()) {
			countVisit += 1
		}
		return currVisit
	})
	return countVisit
}

/**
 * Returns boolean whether same-day qr member visit is associated with awarded points
 * @param member
 */
export const checkQrMemberVisitAwardedPointsToday = async (member: Member) => {
	const todayStartDateTime = new Date().setHours(0, 0, 0, 0)
	const dateTimeNow = new Date()

	const lastQrVisitPointAward = await db.Point.findOne({
		where: {
			memberId: member.memberId,
			processedAt: {
				[Op.gt]: todayStartDateTime,
				[Op.lt]: dateTimeNow
			},
			source: 'qr-visit'
		}
	})
	return lastQrVisitPointAward !== null
}

/**
 * Records a member visit via member code barcode scan/manual input while awarding points if enabled
 */
export const recordMemberVisitByMemberCode = async (member: Member, transaction?: Transaction): Promise<Member> => {
	if (!member) throw new AppError(CONFLICT_ERROR, 'Could not register member visit by member code')

	// TODO: Store default point award toggling and number of points in system settings
	// Then check systemSettings if visits by default award points and obtain default point award if it is enabled
	const pointsToAward = 0
	return recordMemberVisit({ member, pointsToAward, source: 'kakeru', transaction })
}

/**
 * Records a member visit via qr-code while awarding points, limited to once per day
 * @returns Object containing member and pointsRedeemed, a boolean stating whether member is awarded points
 */
export const recordMemberVisitByStoreQrCode = async (
	member: Member,
	transaction?: Transaction
): Promise<{ member: Member; pointsRedeemed: boolean }> => {
	if (!member) throw new AppError(CONFLICT_ERROR, 'Could not register member visit by qrcode')

	const alreadyAwardedPointsOnTodaysVisit = await checkQrMemberVisitAwardedPointsToday(member)

	// Return member without recording visit
	if (alreadyAwardedPointsOnTodaysVisit) {
		return { member, pointsRedeemed: false }
	} else {
		const pointsToAward = 0
		const updatedMember = await recordMemberVisit({ member, pointsToAward, source: 'qr-visit', transaction })
		return { member: updatedMember, pointsRedeemed: true }
	}
}

/**
 * Record a member visit with associated points
 * @param member Member to modify
 * @param pointsToAward Number of points to award for the visit
 * @param transaction
 * @returns Updated member with new visit and total kakeru points
 */
export const recordMemberVisit = async ({
	member,
	pointsToAward,
	source,
	transaction
}: {
	member: Member
	pointsToAward: number
	source?: pointSource
	transaction?: Transaction
}) => {
	const currentTime = new Date()

	// Register a store visit
	const lastVisit = await member.createVisit({ visitDate: currentTime }, { transaction })

	let newTotalPoints = null

	const { kakeruPoint } = member
	newTotalPoints = Number(kakeruPoint) + pointsToAward
	if (newTotalPoints < 0) {
		throw new AppError(SYSTEM_ERROR, 'total point amount cannot be negative')
	}
	member.set({ kakeruPoint: newTotalPoints })
	await member.createPoint(
		{
			visitId: lastVisit?.memberVisitId || null,
			point: pointsToAward,
			processedAt: currentTime,
			source
		},
		{ transaction }
	)

	if (member.changed()) {
		await member.save({ transaction })
	}
	return member
}
