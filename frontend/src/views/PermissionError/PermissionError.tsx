import React from 'react'
import { Result } from 'antd'
import { COMMONS } from '@/utils'

const PermissionError = (props) => {
	return (
		<div className="flex h-screen">
			<div className="m-auto">
				<Result status="403" title="401" subTitle={COMMONS.ERROR_401_MSG} />
			</div>
		</div>
	)
}

export default PermissionError
