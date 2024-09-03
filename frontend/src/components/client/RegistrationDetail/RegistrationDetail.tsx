import { COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import moment from 'moment'
import { Descriptions } from 'antd'

const RegistrationDetail = (props) => {
	const { publicSettings, registration } = props

	return (
		<motion.div
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
			initial="hidden"
			animate="show"
			exit="hidden"
		>
			<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
				<Descriptions column={1} labelStyle={{ width: '135px' }} contentStyle={{ padding: '1rem' }} bordered>
					<Descriptions.Item label={`${COMMONS.DEFAULT_SYSTEM_TYPE}`}>
						<p className="text-sm">{registration?.Category?.title || 'ー'}</p>
					</Descriptions.Item>
					{registration?.Occasion?.title && (
						<Descriptions.Item label={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム`}>
							<p className="text-sm">{registration.Occasion.title}</p>
						</Descriptions.Item>
					)}
					<Descriptions.Item label="日時">
						<p className="text-sm">
							{registration?.Occurrence?.startDate
								? moment(registration.Occurrence.startDate).format('YYYY年M月D日（ddd）')
								: 'ー'}
						</p>
						<p className="text-sm mt-2">
							<span
								className="inline-block rounded-full text-white px-2 mr-1 mb-1"
								style={{
									backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								{registration?.Occurrence?.startAt
									? moment(registration.Occurrence.startAt).format('HH:mm')
									: 'ー'}
								～
								{registration?.Occurrence?.endAt
									? moment(registration.Occurrence.endAt).format('HH:mm')
									: 'ー'}
							</span>
						</p>
					</Descriptions.Item>
					<Descriptions.Item label="メッセージ">
						<p className="text-sm whitespace-pre-wrap">{registration?.message || 'ー'}</p>
					</Descriptions.Item>
					{registration?.note?.map((item) => (
						<Descriptions.Item label={item?.lable}>
							<p className="text-sm whitespace-pre-wrap">{item?.value || 'ー'}</p>
						</Descriptions.Item>
					))}
				</Descriptions>
			</motion.div>
		</motion.div>
	)
}

export default RegistrationDetail
