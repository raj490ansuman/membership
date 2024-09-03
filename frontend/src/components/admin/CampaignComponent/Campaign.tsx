import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { Badge, Card, Divider, Image } from 'antd'
import { ReservationDurationComponent, StatusCampaignComponent } from '@/components'

const CampaignComponent = (props) => {
	const { campaign } = props
	return (
		<Badge.Ribbon
			text={
				campaign?.isDisplayed ? (
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
			color={campaign?.isDisplayed ? COMMONS.CUSTOM_GREEN : COMMONS.CUSTOM_RED}
		>
			<Card
				hoverable
				className={COMMONS.IS_ACTIVE(campaign?.endRegistration) && campaign?.isDisplayed ? '' : 'grayscale'}
				cover={
					campaign?.categoryImages && campaign?.categoryImages?.length > 0 ? (
						<Image
							preview={false}
							src={`${API.CATEGORIES_UPLOADS_URL}${campaign.categoryImages[0]?.picUrl}`}
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
					{campaign?.title || ''}
				</p>
				<Divider className="my-8">{`${COMMONS.PAGE_ADMIN_LIST_CAMPAIGN}状況`}</Divider>
				<StatusCampaignComponent
					{...props}
					maxCapacity={campaign?.sumExpected}
					sumExpected={campaign?.sumExpected}
				/>

				<>
					<Divider className="my-8">応募可能期間</Divider>
					<ReservationDurationComponent
						{...props}
						start={campaign?.startRegistration}
						end={campaign?.endRegistration}
					/>
				</>
			</Card>
		</Badge.Ribbon>
	)
}

export default CampaignComponent
