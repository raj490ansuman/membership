import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { Card, Image } from 'antd'

const CategoryStat = (props) => {
	const { publicSettings, category } = props

	return (
		<Card
			hoverable
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
			<div
				className="flex grow border rounded"
				style={{ borderColor: publicSettings?.PRIMARY_COLOR?.valueString }}
			>
				<div
					className="flex flex-col basis-full p-2 rounded"
					style={{
						borderColor: COMMONS.SECONDARY_COLOR,
						backgroundColor: COMMONS.WHITE_COLOR,
						color: publicSettings?.PRIMARY_COLOR?.valueString
					}}
				>
					<p className="text-center">予約人数</p>
					<p className="text-center font-bold">
						<span className="text-xl">{category?.sumExpected || 0}</span>
						<span>人</span>
					</p>
				</div>
			</div>
		</Card>
	)
}

export default CategoryStat
