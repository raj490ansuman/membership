import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { Badge, Card, Divider, Image } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { ReservationDurationComponent, StatusComponent } from '@/components'

const Occasion = (props) => {
	const { occasion } = props

	return (
		<Badge.Ribbon
			text={
				occasion?.isDisplayed ? (
					<p>
						<EyeOutlined />
						<span className="ml-1">表示中</span>
					</p>
				) : (
					<p>
						<EyeInvisibleOutlined />
						<span className="ml-1">非表示中</span>
					</p>
				)
			}
			color={occasion?.isDisplayed ? COMMONS.CUSTOM_GREEN : COMMONS.CUSTOM_RED}
		>
			<Card
				hoverable
				className={
					COMMONS.IS_ACTIVE(occasion?.isSettingTime ? occasion?.endDate : occasion?.end) &&
					occasion?.isDisplayed
						? ''
						: 'grayscale'
				}
				// className={
				//   COMMONS.IS_ACTIVE(occasion?.end) && occasion?.isDisplayed
				//     ? ""
				//     : "grayscale"
				// }
				cover={
					occasion?.occasionImages && occasion?.occasionImages?.length > 0 ? (
						occasion.occasionImages[0]?.picUrl ? (
							<Image
								preview={false}
								src={`${API.OCCASIONS_UPLOADS_URL}${occasion.occasionImages[0]?.picUrl}`}
								fallback="/no-image.png"
								height={350}
								width="100%"
								className="object-contain"
								alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像`}
							/>
						) : (
							<Image
								preview={false}
								src="/no-image.png"
								height={350}
								width="100%"
								className="object-contain"
								alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像`}
							/>
						)
					) : (
						<Image
							preview={false}
							src="/no-image.png"
							height={350}
							width="100%"
							className="object-contain"
							alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像`}
						/>
					)
				}
			>
				<p className="text-center text-base font-bold text-ellipsis overflow-hidden h-12 leading-6 line-clamp-2 mb-4">
					{occasion?.title || ''}
				</p>
				<Divider className="my-8">予約状況</Divider>
				<StatusComponent {...props} maxCapacity={occasion?.maxCapacity} sumExpected={occasion?.sumExpected} />
				{/* <Divider className="my-8">予約期間（自動計算）</Divider> */}
				{/* <ReservationDurationComponent
          {...props}
          start={occasion?.start}
          end={occasion?.end}
        /> */}
				{occasion?.isSettingTime ? (
					<>
						<Divider className="my-8">予約期間・イベント期間</Divider>
						<ReservationDurationComponent {...props} start={occasion?.startDate} end={occasion?.endDate} />
					</>
				) : (
					<>
						<Divider className="my-8">予約期間（自動計算）</Divider>
						<ReservationDurationComponent {...props} start={occasion?.start} end={occasion?.end} />
					</>
				)}
			</Card>
		</Badge.Ribbon>
	)
}

export default Occasion
