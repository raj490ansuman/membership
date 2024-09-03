import moment from 'moment'
import { Image } from 'antd'
import { API, COMMONS } from '@/utils'

const ManagerChatMessage = ({
	publicSettings,
	chat,
}: {
	publicSettings: any
	chat: ChatMessage
}) => {
	const { GRAY_COLOR, ChatMessageContentType } = COMMONS

	const getChatMessageContent = (type: string) => {
		switch (type) {
			case ChatMessageContentType.TEXT:
				return (
					<div
						className='text-white rounded-lg p-2 cursor-pointer'
						style={{
							backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString,
						}}
					>
						<span className='whitespace-pre-wrap'>{chat?.contents || ''}</span>
					</div>
				)
			case ChatMessageContentType.IMAGE:
				return <Image width={200} src={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`} />

			default:
				return <div>{chat.contents}</div>
		}
	}
	return (
		<>
			<div className='flex flex-row items-start justify-end'>
				{getChatMessageContent(chat?.contentType)}
			</div>
			<div className='flex flex-row items-start justify-end'>
				<span
					className='whitespace-pre-wrap'
					style={{
						fontSize: '10px',
						color: GRAY_COLOR,
					}}
				>
					{chat?.createdAt ? moment(chat.createdAt).format('YYYY年M月D日 HH:mm') : ''}
				</span>
			</div>
		</>
	)
}

export default ManagerChatMessage
