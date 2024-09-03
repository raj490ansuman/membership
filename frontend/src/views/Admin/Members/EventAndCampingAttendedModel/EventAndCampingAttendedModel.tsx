import { Button, Modal, Table, Tabs, message } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import { TapAnimationComponent } from '@/components'
import { API } from '@/utils'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import styled from 'styled-components'

const StyleTable = styled(Table)`
	max-height: 60vh !important;

	.ant-table-container {
		max-height: 50vh !important;
		overflow-y: scroll;
	}

	.ant-table-content {
		min-width: 560px;
	}
`

const EventAndCampingAttendedModel = (props: Props) => {
	const { open, onCancel, memberId } = props
	const navigate = useNavigate()

	const [dataColumnEvent, setDataColumnEvent] = useState([])

	const columnEvent = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id'
		},
		{
			title: 'イベント名',
			dataIndex: 'nameEvent',
			key: 'nameEvent'
		},
		{
			title: '予約日付',
			dataIndex: 'date',
			key: 'date',
			render: (value: Date, row: { startAt: Date; endAt: Date }) => {
				return (
					<>
						<p>{moment(value).format('YYYY-MM-DD')}</p>
						<p>{`${moment(row?.startAt).format('HH:mm')} ~ ${moment(row?.endAt).format('HH:mm')}`}</p>
					</>
				)
			}
		},
		{
			title: '行動',
			dataIndex: 'action',
			key: 'action'
		}
	]

	const columnsPampaign = [
		{
			title: 'ID',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: 'キャンペーン名 ',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: '応募日付',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: '結果',
			dataIndex: 'name',
			key: 'name'
		},
		{
			title: '回答',
			dataIndex: 'name',
			key: 'name'
		}
	]

	useQuery([API.QUERY_KEY_ADMIN_HISTORY_REGISTRATIONS, memberId], () => API.ADMIN_GET_HISTORY_ATTENDED(memberId), {
		enabled: open && !!memberId,
		onSuccess: (response) => {
			setDataColumnEvent(response?.data)
		},
		onError: (error: FetchError) => {
			if (error?.response?.status === COMMONS.RESPONSE_PERMISSION_ERROR) {
				navigate(COMMONS.PERMISSION_ERROR_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SESSION_ERROR) {
				message.warning({
					content: COMMONS.ERROR_SESSION_MSG,
					key: COMMONS.MESSAGE_SESSION_ERROR_KEY
				})
				navigate(COMMONS.ADMIN_LOGIN_ROUTE)
			} else if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
				})
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY
				})
			}
		}
	})

	return (
		<Modal
			open={open}
			onCancel={onCancel}
			footer={null}
			width={720}
			destroyOnClose
			centered
			styles={{
				body: {
					maxHeight: '90vh'
				}
			}}
		>
			<Tabs defaultActiveKey="1" className="mb-8">
				<TabPane tab="参加イベント履歴" key="1">
					<StyleTable
						// scroll={{
						//   x: 640,
						//   y: 610,
						// }}
						bordered
						size="small"
						className="w-full"
						dataSource={dataColumnEvent}
						//@ts-expect-error
						columns={columnEvent}
					/>
				</TabPane>
				<TabPane tab="応募キャンペーン履歴" key="2">
					<Table
						scroll={{
							x: 640,
							y: 610
						}}
						bordered
						size="small"
						className="w-full"
						dataSource={[]}
						columns={columnsPampaign}
					/>
				</TabPane>
			</Tabs>

			<motion.div
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
				initial="hidden"
				animate="show"
				exit="hidden"
			>
				<motion.div className="flex justify-center" variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
					<TapAnimationComponent>
						<Button size="large" className="px-12 text-black" onClick={onCancel}>
							閉じる
						</Button>
					</TapAnimationComponent>
				</motion.div>
			</motion.div>
		</Modal>
	)
}

export default EventAndCampingAttendedModel
