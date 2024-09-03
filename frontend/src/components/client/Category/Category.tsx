import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { RightOutlined } from '@ant-design/icons'
import { Card, Image, message } from 'antd'
// import styled from "styled-components"
import { TagComponent } from '@/components'
import styled from 'styled-components'

// const CustomDescriptions = styled(Descriptions)`
//   .ant-descriptions-view {
//     border-color: ${(props) => props.$publicSettings?.PRIMARY_COLOR?.valueString};
//   }
//   .ant-descriptions-row {
//     border-color: ${(props) => props.$publicSettings?.PRIMARY_COLOR?.valueString};
//   }

//   .ant-descriptions-item-label,
//   .ant-descriptions-bordered .ant-descriptions-item-content {
//     border-color: ${(props) => props.$publicSettings?.PRIMARY_COLOR?.valueString};
//   }
// `

const StyleText = styled.div`
	top: 0;
	left: 0;
	padding: 0 4px;
	border-radius: 4px;
	margin-left: 3px;
	margin-top: 3px;
	font-size: 0.75rem !important;
	line-height: 1rem !important;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 33%;
`
const StyleWrapText = styled.div`
	padding-right: 3px;
`

const Category = (props) => {
	const { publicSettings, category, disable } = props

	return (
		<Card
			style={{
				backgroundColor: disable ? 'rgb(203 213 225)' : ''
			}}
			onClick={() => {
				disable &&
					message.warning({
						content: 'このイベントは同時に複数のイベント予約はできません。',
						key: 'Error'
					})
			}}
			styles={{ body: { padding: 0 } }}
			className="drop-shadow"
			cover={
				<div className="relative">
					<StyleWrapText className="absolute flex gap-1 z-10 box-border w-full">
						{category?.categoryTags
							?.filter((_, index) => index < 3)
							?.map((item) => (
								<StyleText
									className="box-border"
									style={{
										backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
										color: publicSettings?.PRIMARY_COLOR?.valueString,
										border: `1px solid ${publicSettings?.PRIMARY_COLOR?.valueString}`
									}}
								>
									{item?.contents}
								</StyleText>
							))}
					</StyleWrapText>
					{category?.categoryImages && category?.categoryImages?.length > 0 ? (
						<Image
							preview={false}
							src={`${API.CATEGORIES_UPLOADS_URL}${category.categoryImages[0]?.picUrl}`}
							fallback="/no-image.png"
							height={130}
							width="100%"
							className="object-cover rounded-t"
							style={{ padding: '1px' }}
							alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}画像`}
						/>
					) : (
						<Image
							preview={false}
							src="/no-image.png"
							height={130}
							width="100%"
							className="object-cover"
							style={{ padding: '1px' }}
							alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}画像`}
						/>
					)}
					<div className="absolute left-0 top-0">
						{category?.categoryAreas && category?.categoryAreas?.length > 0 ? (
							<div className="flex flex-wrap">
								{category.categoryAreas.map((area) => (
									<TagComponent
										key={area?.contents}
										backgroundColor={publicSettings?.PRIMARY_LIGHT_COLOR.valueString}
										borderColor={publicSettings?.PRIMARY_COLOR?.valueString}
										color={publicSettings?.PRIMARY_COLOR?.valueString}
										text={area?.contents || ''}
									/>
								))}
							</div>
						) : (
							''
						)}
					</div>
				</div>
			}
		>
			<div className="py-2">
				<p className="text-center text-sm font-bold h-12 leading-6 line-clamp-2 px-4">
					{category?.title || ''}
				</p>
				<p className="text-sm h-12 leading-6 line-clamp-2 px-2">{category?.sub || ''}</p>
			</div>
			<div
				className="flex justify-aroun items-center w-full p-2"
				style={{
					backgroundColor: disable ? 'rgb(203 213 225)' : publicSettings?.PRIMARY_COLOR?.valueString
				}}
			>
				<div className="flex-1">
					<p className="text-center text-base font-bold text-white">詳細・予約</p>
				</div>
				<div className="flex-none">
					<RightOutlined className="text-white" />
				</div>
			</div>
		</Card>
	)
}

export default Category
