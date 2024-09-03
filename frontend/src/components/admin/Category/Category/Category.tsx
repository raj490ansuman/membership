import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { Badge, Card, Divider, Image } from 'antd'
import { ReservationDurationComponent, StatusComponent } from '@/components'

const Category = (props) => {
	const { category } = props

	return (
		<Badge.Ribbon
			text={
				category?.isDisplayed ? (
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
			color={category?.isDisplayed ? COMMONS.CUSTOM_GREEN : COMMONS.CUSTOM_RED}
		>
			<Badge.Ribbon
				className="mt-8"
				text={
					!category?.isProgram ? (
						<p>
							<span className="ml-1">プログラム無し</span>
						</p>
					) : (
						<p>
							<span className="ml-1">プログラム有り</span>
						</p>
					)
				}
				color={category?.isDisplayed ? COMMONS.CUSTOM_GREEN : COMMONS.CUSTOM_RED}
			>
				<Card
					hoverable
					className={
						COMMONS.IS_ACTIVE(category?.isSettingTime ? category?.endDate : category?.end) &&
						category?.isDisplayed
							? ''
							: 'grayscale'
					}
					cover={
						category?.categoryImages && category?.categoryImages?.length > 0 ? (
							<Image
								preview={false}
								src={`${API.CATEGORIES_UPLOADS_URL}${category.categoryImages[0]?.picUrl}`}
								fallback="/no-image.png"
								height={250}
								width="100%"
								className="object-cover"
								alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}画像`}
							/>
						) : (
							<Image
								preview={false}
								src="/no-image.png"
								height={250}
								width="100%"
								className="object-cover"
								alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}画像`}
							/>
						)
					}
				>
					<p className="text-center text-base font-bold text-ellipsis overflow-hidden h-12 leading-6 line-clamp-2 mb-4">
						{category?.title || ''}
					</p>
					<Divider className="my-8">予約状況</Divider>
					<StatusComponent
						{...props}
						maxCapacity={category?.maxCapacity}
						sumExpected={category?.sumExpected}
					/>
					{category?.isSettingTime ? (
						<>
							<Divider className="my-8">予約期間・イベント期間</Divider>
							<ReservationDurationComponent
								{...props}
								start={category?.startDate}
								end={category?.endDate}
							/>
						</>
					) : (
						<>
							<Divider className="my-8">予約期間（自動計算）</Divider>
							<ReservationDurationComponent {...props} start={category?.start} end={category?.end} />
						</>
					)}
				</Card>
			</Badge.Ribbon>
		</Badge.Ribbon>
	)
}

export default Category
