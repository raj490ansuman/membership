import { Card } from 'antd'
import { COMMONS } from '@/utils'
import moment from 'moment'

const Occurrence = (props) => {
	const { publicSettings, occurrence, isDetail, category } = props

	return isDetail ? (
		<Card
			hoverable={false}
			bordered={false}
			styles={{ body: { padding: 0 } }}
			className={occurrence?.isDisplayed ? '' : 'grayscale'}
		>
			<div
				className="flex flex-col border rounded"
				style={{ borderColor: publicSettings?.PRIMARY_COLOR?.valueString }}
			>
				<div
					className="flex p-2 rounded-t border-b justify-center"
					style={COMMONS.OCCURRENCE_TIME_STYLE(publicSettings)}
				>
					{category?.isSettingTime ? (
						<span className="font-bold text-lg">
							{occurrence?.startDate && category?.startDate
								? `${moment(occurrence.startDate).format('YYYY年M月D日　')}${moment(
										category.startDate
								  ).format('HH:mm')} `
								: 'ー：ー'}
						</span>
					) : (
						<span className="font-bold text-lg">
							{occurrence?.startAt ? moment(occurrence.startAt).format('YYYY年M月D日　HH:mm') : 'ー：ー'}
						</span>
					)}
				</div>
				<div className="flex flex-row">
					<div className="flex flex-col basis-6/12 p-2" style={COMMONS.RESERVATION_STYLE(publicSettings)}>
						<p className="text-center">予約可能最大人数</p>
						<p className="text-center font-bold">
							<span className="text-xl">{occurrence?.maxAttendee || 0}</span>
							<span>人</span>
						</p>
					</div>
					<div
						className="flex flex-col basis-6/12 p-2 rounded"
						style={COMMONS.ATTENDED_STYLE(publicSettings)}
					>
						<p className="text-center">予約人数</p>
						<p className="text-center font-bold">
							<span className="text-xl">{occurrence?.sumExpected || 0}</span>
							<span>人</span>
						</p>
					</div>
				</div>
			</div>
		</Card>
	) : (
		<div className={`h-full ${occurrence?.isDisplayed ? '' : 'grayscale'}`}>
			<div className="flex h-full">
				<div
					className="flex flex-col basis-6/12 justify-center"
					style={COMMONS.RESERVATION_STYLE(publicSettings)}
				>
					<p className="text-center text-sm hidden sm:block">最大</p>
					<p className="text-center font-bold">
						<span className="text-xl">{occurrence?.maxAttendee || 0}</span>
						<span className="text-xs">人</span>
					</p>
				</div>
				<div className="flex flex-col basis-6/12 justify-center" style={COMMONS.ATTENDED_STYLE(publicSettings)}>
					<p className="text-center text-sm hidden sm:block">予約</p>
					<p className="text-center font-bold">
						<span className="text-xl">{occurrence?.sumExpected || 0}</span>
						<span className="text-xs">人</span>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Occurrence
