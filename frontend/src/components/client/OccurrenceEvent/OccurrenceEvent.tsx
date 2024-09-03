import { COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import moment from 'moment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TapAnimationComponent } from '@/components'

const CircleSvg = ({ className }) => (
	<svg
		x="0px"
		y="0px"
		width="31.424px"
		height="31.425px"
		viewBox="0 0 31.424 31.425"
		className={className}
		fill="currentColor"
	>
		<g>
			<path
				d="M15.712,3.132c6.937,0,12.581,5.644,12.581,12.58c0,6.938-5.645,12.581-12.581,12.581c-6.937,0-12.58-5.645-12.58-12.581
      C3.132,8.775,8.775,3.132,15.712,3.132 M15.712,0C7.035,0,0,7.034,0,15.712c0,8.679,7.035,15.713,15.712,15.713
      c8.677,0,15.712-7.034,15.712-15.713C31.425,7.034,24.389,0,15.712,0L15.712,0z"
			/>
		</g>
	</svg>
)

const DoubleCircleSvg = ({ className }) => (
	<svg
		x="0px"
		y="0px"
		width="31.424px"
		height="31.425px"
		viewBox="0 0 31.424 31.425"
		className={className}
		fill="currentColor"
	>
		<g>
			<path d="M15.712,3.132c6.937,0,12.581,5.644,12.581,12.58c0,6.938-5.645,12.581-12.581,12.581c-6.937,0-12.58-5.645-12.58-12.581 C3.132,8.775,8.775,3.132,15.712,3.132 M15.712,0C7.035,0,0,7.034,0,15.712c0,8.679,7.035,15.713,15.712,15.713 c8.677,0,15.712-7.034,15.712-15.713C31.425,7.034,24.389,0,15.712,0L15.712,0z" />
			<path d="M 15.602 6.906 C 20.442 6.906 24.38 10.791 24.38 15.566 C 24.38 20.342 20.441 24.226 15.602 24.226 C 10.763 24.226 6.826 20.34 6.826 15.566 C 6.826 10.79 10.763 6.906 15.602 6.906 M 15.602 4.75 C 9.549 4.75 4.641 9.592 4.641 15.566 C 4.641 21.54 9.549 26.382 15.602 26.382 C 21.656 26.382 26.564 21.54 26.564 15.566 C 26.565 9.592 21.656 4.75 15.602 4.75 Z" />
		</g>
	</svg>
)

const CrossSvg = ({ className }) => (
	<svg
		x="0px"
		y="0px"
		width="26px"
		height="26px"
		viewBox="0 0 460.775 460.775"
		className={className}
		fill="currentColor"
	>
		<path
			d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
		/>
	</svg>
)

const OccurrenceEvent = (props) => {
	const { publicSettings, occurrence, status, isProgram } = props
	const { liffId, categoryId, occasionId } = useParams()
	const navigate = useNavigate()

	if (isProgram == null) {
		navigate(navigate(`${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}`))
	}

	const OccurrenceDom = ({ borderColor, textColor, icon, buttonColor }) => (
		<motion.div
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
			initial="hidden"
			animate="show"
			exit="hidden"
			className="flex my-1 border rounded-lg"
			style={{
				borderColor: borderColor
			}}
		>
			<motion.div
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
				className="flex grow flex-col pl-4 pr-2 py-4"
				style={{
					color: textColor
				}}
			>
				<p className="text-sm font-bold">
					{occurrence?.startDate ? moment(occurrence.startDate).format('YYYY年M月D日（ddd）') : 'ー'}
				</p>
				<p className="text-sm">
					{occurrence?.startAt ? moment(occurrence.startAt).format('HH:mm') : 'ー'}～
					{occurrence?.endAt ? moment(occurrence.endAt).format('HH:mm') : 'ー'}
				</p>
				{occurrence?.remarks ? (
					<p className="whitespace-pre-wrap text-xs text-gray-400 mt-1">{occurrence.remarks}</p>
				) : (
					''
				)}
			</motion.div>
			<motion.div
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
				className="flex grow-0 flex-col justify-center items-center px-2"
			>
				{icon}
			</motion.div>
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex grow-0">
				<div
					className="flex justify-center items-center w-20 h-full rounded-r"
					style={{ backgroundColor: buttonColor }}
				>
					<p className="whitespace-pre-wrap text-white font-bold text-center">{`次に\nすすむ`}</p>
				</div>
			</motion.div>
		</motion.div>
	)

	return status === COMMONS.OCCURRENCE_STATUS_AVAILABLE ? (
		<TapAnimationComponent>
			<Link
				to={`${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}/${categoryId}/${occasionId}/${occurrence?.occurrenceId}?isProgram=${isProgram}`}
			>
				<OccurrenceDom
					borderColor={publicSettings?.PRIMARY_COLOR?.valueString}
					textColor={COMMONS.BLACK_COLOR}
					icon={
						<div className="flex flex-col justify-center items-center text-secondary w-[50px]">
							<DoubleCircleSvg />
							<p className="text-xs mt-1 font-bold">余裕あり</p>
						</div>
					}
					buttonColor={publicSettings?.PRIMARY_COLOR?.valueString}
				/>
			</Link>
		</TapAnimationComponent>
	) : status === COMMONS.OCCURRENCE_STATUS_FULL ? (
		<OccurrenceDom
			borderColor={COMMONS.CUSTOM_GRAY_COLOR}
			textColor={COMMONS.CUSTOM_GRAY_COLOR}
			icon={
				<div className="flex flex-col justify-center items-center text-custom-gray w-[50px]">
					<CrossSvg />
					<p className="text-xs mt-1 font-bold">満員</p>
				</div>
			}
			buttonColor={COMMONS.CUSTOM_GRAY_COLOR}
		/>
	) : status === COMMONS.OCCURRENCE_STATUS_ALMOST_FULL ? (
		<TapAnimationComponent>
			<Link
				to={`${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}/${categoryId}/${occasionId}/${occurrence?.occurrenceId}?isProgram=${isProgram}`}
			>
				<OccurrenceDom
					borderColor={publicSettings?.PRIMARY_COLOR?.valueString}
					textColor={COMMONS.BLACK_COLOR}
					icon={
						<div className="flex flex-col justify-center items-center text-custom-green w-[50px]">
							<CircleSvg />
							<p className="text-xs mt-1 font-bold">
								あと
								{COMMONS.GET_LEFT_SLOTS(occurrence?.maxAttendee || 0, occurrence?.sumExpected || 0)}人
							</p>
						</div>
					}
					buttonColor={publicSettings?.PRIMARY_COLOR?.valueString}
				/>
			</Link>
		</TapAnimationComponent>
	) : (
		''
	)
}

export default OccurrenceEvent
