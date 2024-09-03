import React from 'react'
import { Result } from 'antd'
import { COMMONS } from '@/utils'

const NotFound = (props) => {
	return (
		<div className="flex h-screen">
			<div className="m-auto">
				<Result status="404" title="404" subTitle={COMMONS.ERROR_404_MSG} />
			</div>
		</div>
	)
}

export default NotFound
