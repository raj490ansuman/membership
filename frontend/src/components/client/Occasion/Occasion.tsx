import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { RightOutlined } from '@ant-design/icons'
import { Card, Descriptions, Image as ImageAntd } from 'antd'
import styled from 'styled-components'
import { CarouselProvider, Slider, Slide, Image } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import { BaseAnimationComponent } from '@/components'

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
	const { publicSettings, occasion, isProgram } = props

	return (
		<Card
			hoverable
			bordered={false}
			styles={{
				body: {
					padding: 0
				}
			}}
			className="border rounded overflow-hidden"
			style={{
				borderColor: publicSettings?.PRIMARY_COLOR?.valueString
			}}
		>
			<div className="flex flex-col">
				<BaseAnimationComponent>
					<CarouselProvider
						naturalSlideWidth={100}
						totalSlides={occasion?.occasionImages?.length || 1}
						naturalSlideHeight={100}
						lockOnWindowScroll
						infinite
						className="w-full"
					>
						<div className="relative">
							<Slider className="w-full" style={{ maxHeight: '250px' }}>
								{occasion?.occasionImages?.length > 0 ? (
									occasion.occasionImages.map((image, index) => (
										<Slide key={index} index={index}>
											<Image
												src={`${API.OCCASIONS_UPLOADS_URL}${image?.picUrl}`}
												fallback="/no-image.png"
												alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像`}
												className="object-cover max-w-full"
												style={{ maxHeight: '350px' }}
												renderError={
													<Image
														style={{ maxHeight: '350px' }}
														src="/no-image.png"
														alt={occasion?.title || ''}
														className="object-cover max-w-full"
													/>
												}
											/>
										</Slide>
									))
								) : (
									<Slide index={0}>
										<Image
											style={{
												maxHeight: '350px'
											}}
											className="rounded object-cover max-w-full"
											preview={false}
											src="/no-image.png"
											alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像`}
										/>
									</Slide>
								)}
							</Slider>
						</div>
					</CarouselProvider>

					<div className="flex flex-col w-full">
						<p className="text-center font-bold h-12 leading-6 line-clamp-2 px-4 mb-4">
							{occasion?.title || ''}
						</p>
						{occasion?.occasionDetails && occasion?.occasionDetails?.length > 0 ? (
							<CustomDescriptions
								bordered
								column={1}
								size="small"
								layout="vertical"
								$publicSettings={publicSettings}
							>
								{occasion.occasionDetails.map((detail) => (
									<Descriptions.Item key={detail?.label} label={detail?.label || ''}>
										<p className="whitespace-pre-wrap font-bold text-xs">{detail?.value || ''}</p>
									</Descriptions.Item>
								))}
							</CustomDescriptions>
						) : (
							''
						)}
					</div>
				</BaseAnimationComponent>
			</div>
			{isProgram === 'true' && (
				<div
					className="flex justify-around items-center  w-full p-1"
					style={{ backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString }}
				>
					<div className="flex-1">
						<p className="text-center text-lg font-bold text-white">予約</p>
					</div>
					<div className="flex-none">
						<RightOutlined className="text-white" />
					</div>
				</div>
			)}
		</Card>
	)
}

export default Occasion
