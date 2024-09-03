// TODO: Refactor out message component types
import { DownloadOutlined } from '@ant-design/icons'
import { Avatar, Button, Image } from 'antd'
import moment from 'moment'

import { API, COMMONS } from '@/utils'

const UserChatMessage = ({
	chat,
	currentMember,
}: {
	chat: ChatMessage
	currentMember: memberType
}) => {
	const { CUSTOM_GREEN, GRAY_COLOR, ChatMessageContentType } = COMMONS

	const getChatMessageContent = (type: string) => {
		switch (type) {
			case ChatMessageContentType.TEXT:
				return (
					<div
						className='text-white rounded-lg p-2 cursor-pointer mr-1'
						style={{
							backgroundColor: CUSTOM_GREEN,
						}}
					>
						<span className='whitespace-pre-wrap'>{chat?.contents || ''}</span>
					</div>
				)
			case ChatMessageContentType.IMAGE:
				return <Image width={200} src={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`} />
			case ChatMessageContentType.AUDIO:
				return (
					<figure>
						<audio controls src={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`} />
					</figure>
				)
			case ChatMessageContentType.VIDEO:
				return (
					<video controls width={200}>
						<source
							src={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`}
							type='video/mp4'
						/>
					</video>
				)
			case ChatMessageContentType.FILE:
				return (
					<div className='w-1/2 mb-4'>
						<a
							href={`${API.MESSAGE_STORAGE_URL}/${chat.contents}`}
							download={chat.contents}
							target='_blank'
							rel='noreferrer'
						>
							<Button block icon={<DownloadOutlined rev={undefined} />}>
								ダウンロード
							</Button>
						</a>
						<p
							className='hover:opacity-75'
							style={{ fontSize: '12px', color: COMMONS.PRIMARY_COLOR }}
						>
							{chat.contents}
						</p>
					</div>
				)
			default:
				return <div>{chat.contents}</div>
		}
	}

	return (
		<>
			<div className='flex flex-row items-start justify-start'>
				<div className='mr-1'>
					<Avatar
						size={40}
						src={
							currentMember?.picUrl ? (
								<Image
									preview={false}
									width={40}
									height={40}
									src={`${currentMember.picUrl}/small`}
									fallback='/no-image.png'
								/>
							) : (
								<Image src='/no-image.png' width={40} height={40} preview={false} />
							)
						}
					/>
				</div>
				{getChatMessageContent(chat?.contentType)}
			</div>
			<div className='flex flex-row items-start justify-start'>
				<span
					className='whitespace-pre-wrap'
					style={{
						fontSize: '10px',
						color: GRAY_COLOR,
						marginLeft: '45px',
					}}
				>
					{chat?.createdAt ? moment(chat.createdAt).format('YYYY年M月D日 HH:mm') : ''}
				</span>
			</div>
		</>
	)
}

export default UserChatMessage
