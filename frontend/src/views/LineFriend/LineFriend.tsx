import React from 'react'
import { Result } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { COMMONS } from '@/utils'

const LineFriend = (props) => {
	const { publicSettings } = props

	return (
		<div className="flex h-screen">
			<div className="m-auto">
				<Result status="403" title="友だち追加してください" subTitle={COMMONS.ERROR_LINE_FRIEND_MSG} />
				<div className="flex justify-center">
					<div
						className="p-4 rounded"
						style={{ backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString }}
					>
						<a
							rel="noopener noreferrer"
							className="text-white"
							href={import.meta.env.VITE_APP_LINE_ADD_FRIEND_URL}
						>
							<UserAddOutlined className="mr-2" />
							友だち追加
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LineFriend
