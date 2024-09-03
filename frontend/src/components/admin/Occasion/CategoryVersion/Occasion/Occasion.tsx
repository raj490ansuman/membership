import { COMMONS } from '@/utils'
import { API } from '@/utils'
import { Badge, Card, Descriptions, Image } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const CustomDescriptions = styled(Descriptions)`
	.ant-descriptions-view {
		border: none;
		border-top: 1px solid ${(props) => props.$publicSettings?.PRIMARY_COLOR?.valueString};
		border-radius: 0;
	}
	.ant-descriptions-row {
		border-color: ${(props) => props.$publicSettings?.PRIMARY_COLOR?.valueString};
	}

	.ant-descriptions-item-label {
		display: table-cell;
		text-align: center;
		font-weight: bold;
		background-color: ${(props) => props?.$publicSettings?.PRIMARY_LIGHT_COLOR.valueString};
		color: ${(props) => props?.$publicSettings?.PRIMARY_COLOR?.valueString};
		border-radius: 0.25rem;
	}

	.ant-descriptions-item-content {
		background-color: ${COMMONS.WHITE_COLOR};
		border-radius: 0.25rem;
		text-align: center;
	}
`

const Occasion = (props) => {
	const { publicSettings, occasion } = props

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
				bordered={false}
				styles={{ body: { padding: 0 } }}
				className={`border rounded ${occasion?.isDisplayed ? '' : 'grayscale'}`}
				style={{
					borderColor: publicSettings?.PRIMARY_COLOR?.valueString
				}}
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
				<p className="text-center text-base font-bold text-ellipsis overflow-hidden h-12 leading-6 line-clamp-2 px-4 mb-4">
					{occasion?.title || ''}
				</p>

				{occasion?.occasionDetails && occasion?.occasionDetails?.length > 0 ? (
					<CustomDescriptions
						bordered
						column={1}
						$publicSettings={publicSettings}
						labelStyle={{
							whiteSpace: 'pre-wrap',
							fontWeight: 'bold',
							backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
							color: publicSettings?.PRIMARY_COLOR?.valueString
						}}
						size="small"
					>
						{occasion?.occasionDetails?.map((detail) => (
							<Descriptions.Item key={detail?.label || ''} label={detail?.label || ''}>
								<p className="whitespace-pre-wrap font-bold">{detail?.value || ''}</p>
							</Descriptions.Item>
						))}
					</CustomDescriptions>
				) : (
					''
				)}
			</Card>
		</Badge.Ribbon>
	)
}

export default Occasion
