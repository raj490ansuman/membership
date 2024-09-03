import React from 'react'
import { Result } from 'antd'
import { COMMONS } from '@/utils'

const LineAccess = (props) => {
	return (
		<div className="flex h-screen">
			<div className="m-auto">
				<Result status="403" title="403" subTitle={COMMONS.ERROR_LINE_403_MSG} />
			</div>
		</div>
	)
}

export default LineAccess
