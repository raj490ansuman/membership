import { Progress, Tooltip } from 'antd'
import { COMMONS } from '@/utils'
import styled from 'styled-components'

const CustomProgress = styled(Progress)`
	.ant-progress-text {
		white-space: pre-wrap !important;
		color: #595959 !important;
		font-size: 14px !important;
	}
`

const StatusProgress = (props) => {
	const { publicSettings, expected, maxCapacity } = props

	return (
		<div className="flex justify-center">
			<Tooltip title="(予約人数/予約可能最大人数)*100">
				<div className="m-1">
					<CustomProgress
						$publicSettings={publicSettings}
						type="circle"
						strokeColor={publicSettings?.PRIMARY_COLOR?.valueString}
						percent={COMMONS.FIND_PERCENTAGE(expected, maxCapacity)}
						format={(percent) => `予約率\n\n${percent}%`}
					/>
				</div>
			</Tooltip>
		</div>
	)
}

export default StatusProgress
