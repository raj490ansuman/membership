import { COMMONS } from '@/utils'

const Status = (props) => {
	const { publicSettings, maxCapacity, sumExpected } = props

	return (
		<div className="flex grow border rounded" style={{ borderColor: publicSettings?.PRIMARY_COLOR?.valueString }}>
			<div className="flex flex-col basis-1/2 p-2" style={COMMONS.RESERVATION_STYLE(publicSettings)}>
				<p className="text-center">応募者数</p>
				<p className="text-center font-bold">
					<span className="text-xl">{maxCapacity || 0}</span>
					<span>人</span>
				</p>
			</div>
			<div className="flex flex-col basis-1/2 p-2 rounded" style={COMMONS.ATTENDED_STYLE(publicSettings)}>
				<p className="text-center">当選者数</p>
				<p className="text-center font-bold">
					<span className="text-xl">{0}</span>
					<span>人</span>
				</p>
			</div>
		</div>
	)
}

export default Status
