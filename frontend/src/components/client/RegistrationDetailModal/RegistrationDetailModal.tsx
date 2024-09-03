import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { Button, Descriptions, Image, Modal } from 'antd'
import { TagComponent, TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import moment from 'moment'
import QRCode from 'qrcode.react'
import { encode } from 'base-64'

const RegistrationDetailModal = (props) => {
	const { publicSettings, isRegistrationDetailModalVisible, hideRegistrationDetailModal, registration } = props
	return (
		<>
			<Modal
				open={isRegistrationDetailModalVisible}
				onCancel={hideRegistrationDetailModal}
				title="予約詳細"
				footer={null}
				destroyOnClose
				styles={{
					body: {
						maxHeight: '80vh',
						overflowY: 'auto',
						overflowX: 'hidden'
					}
				}}
				centered
			>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="mb-8"
				>
					<div className="flex items-center flex-col mt-4">
						<QRCode
							value={registration?.registrationId ? encode('H-' + registration?.registrationId) : ''}
							size={200}
							level={'H'}
							bgColor={'#ffffff'}
							fgColor={'#000000'}
						/>
						<p className="font-bold mt-2 text-base text-center">
							当日受付でQRコードを提示ください
							<br />
							お待ちしております！
						</p>
					</div>
					<p
						className="px-4 py-2 text-center text-lg font-bold mt-4 mb-4 rounded"
						style={{
							backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
							color: publicSettings?.PRIMARY_COLOR?.valueString
						}}
					>
						予約日付
					</p>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
						<p className="text-center text-lg font-bold">
							{registration?.Occurrence?.startDate
								? moment(registration.Occurrence.startDate).format('YYYY年M月D日（ddd）')
								: 'ー'}
						</p>
						<p className="text-center text-base mt-2">
							<span
								className="inline-block rounded-full text-white px-2 mr-1 mb-1"
								style={{
									backgroundColor: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								<p>
									{`${
										registration?.Occurrence?.startAt
											? moment(registration.Occurrence.startAt).format('HH:mm')
											: 'ー'
									}
                  ～
                  ${registration?.Occurrence?.endAt ? moment(registration.Occurrence.endAt).format('HH:mm') : 'ー'}`}
								</p>
							</span>
						</p>
					</motion.div>
					<p
						className="px-4 py-2 text-center text-lg font-bold mt-4 mb-4 rounded"
						style={{
							backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
							color: publicSettings?.PRIMARY_COLOR?.valueString
						}}
					>
						予約メッセージ
					</p>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
						<p className="text-center text-base">{registration?.message || 'ー'}</p>
					</motion.div>
					<p
						className="px-4 py-2 text-center text-lg font-bold mt-4 mb-4 rounded"
						style={{
							backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
							color: publicSettings?.PRIMARY_COLOR?.valueString
						}}
					>
						{`${COMMONS.DEFAULT_SYSTEM_TYPE}情報`}
					</p>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
						{registration?.Category?.categoryImages &&
						registration?.Category?.categoryImages?.length > 0 ? (
							<Image
								preview={false}
								src={`${API.CATEGORIES_UPLOADS_URL}${registration.Category.categoryImages[0]?.picUrl}`}
								fallback="/no-image.png"
								height={250}
								width="100%"
								className="object-cover rounded-t"
								style={{ padding: '1px' }}
								alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}画像`}
							/>
						) : (
							<Image
								preview={false}
								src="/no-image.png"
								height={250}
								width="100%"
								className="object-cover"
								style={{ padding: '1px' }}
								alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}画像`}
							/>
						)}
						<p className="px-4 py-2 text-center text-lg font-bold">{registration?.Category?.title || ''}</p>
						{registration?.Category?.description ? (
							<p className="whitespace-pre-wrap text-center">{registration.Category.description}</p>
						) : (
							''
						)}
						{registration?.Category?.campaignText ? (
							<motion.div
								className="flex justify-center mt-4"
								variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
							>
								<p className="bg-custom-campaign text-white font-bold whitespace-pre-wrap text-center p-4 rounded">
									{registration.Category.campaignText}
								</p>
							</motion.div>
						) : (
							''
						)}
						{registration?.Category?.categoryDetails &&
						registration?.Category?.categoryDetails?.length > 0 ? (
							<>
								<p
									className="px-4 py-2 text-center text-lg font-bold mt-8 mb-4 rounded"
									style={{
										backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
										color: publicSettings?.PRIMARY_COLOR?.valueString
									}}
								>
									{`${COMMONS.DEFAULT_SYSTEM_TYPE}概要`}
								</p>
								<motion.div
									className="flex flex-col justify-center"
									variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
								>
									<Descriptions
										bordered
										column={1}
										labelStyle={{
											width: '150px',
											whiteSpace: 'pre-wrap',
											fontWeight: 'bold',
											backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
											color: publicSettings?.PRIMARY_COLOR?.valueString
										}}
										size="small"
									>
										{registration.Category.categoryDetails.map((detail) => (
											<Descriptions.Item key={detail?.label} label={detail?.label || ''}>
												<p className="whitespace-pre-wrap font-bold">{detail?.value || ''}</p>
											</Descriptions.Item>
										))}
									</Descriptions>
								</motion.div>
							</>
						) : (
							''
						)}
						{registration?.Category?.categoryTags && registration?.Category?.categoryTags?.length > 0 ? (
							<>
								<p
									className="px-4 py-2 text-center text-lg font-bold mt-4 mb-4 rounded"
									style={{
										backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
										color: publicSettings?.PRIMARY_COLOR?.valueString
									}}
								>
									特徴
								</p>
								<div className="flex flex-wrap justify-center">
									{registration.Category.categoryTags.map((tag) => (
										<TagComponent
											key={tag?.contents}
											backgroundColor={publicSettings?.PRIMARY_LIGHT_COLOR.valueString}
											borderColor={publicSettings?.PRIMARY_COLOR?.valueString}
											color={publicSettings?.PRIMARY_COLOR?.valueString}
											text={tag?.contents || ''}
										/>
									))}
								</div>
							</>
						) : (
							''
						)}
						{registration?.Category?.categoryAreas && registration?.Category?.categoryAreas?.length > 0 ? (
							<>
								<p
									className="px-4 py-2 text-center text-lg font-bold mt-4 mb-4 rounded"
									style={{
										backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
										color: publicSettings?.PRIMARY_COLOR?.valueString
									}}
								>
									エリア
								</p>
								<div className="flex flex-wrap justify-center">
									{registration.Category.categoryAreas.map((area) => (
										<TagComponent
											key={area?.contents}
											backgroundColor={publicSettings?.PRIMARY_LIGHT_COLOR.valueString}
											borderColor={publicSettings?.PRIMARY_COLOR?.valueString}
											color={publicSettings?.PRIMARY_COLOR?.valueString}
											text={area?.contents || ''}
										/>
									))}
								</div>
							</>
						) : (
							''
						)}
						{registration?.Category?.location ? (
							<>
								<p
									className="px-4 py-2 text-center text-lg font-bold mt-8 mb-4 rounded"
									style={{
										backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
										color: publicSettings?.PRIMARY_COLOR?.valueString
									}}
								>
									周辺地図
								</p>
								<motion.div
									className="flex flex-col justify-center"
									variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
								>
									<iframe
										title="周辺地図"
										src={registration.Category.location}
										height="450"
										sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
										style={{
											border: `1px solid ${publicSettings?.PRIMARY_COLOR?.valueString}`,
											borderRadius: '0.25rem'
										}}
									/>
								</motion.div>
							</>
						) : (
							''
						)}
					</motion.div>
					{registration?.Occasion && (
						<>
							<p
								className="px-4 py-2 text-center text-lg font-bold mt-4 mb-4 rounded"
								style={{
									backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
									color: publicSettings?.PRIMARY_COLOR?.valueString
								}}
							>
								{`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム情報`}
							</p>
							<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
								{registration?.Occasion?.occasionImages &&
								registration?.Occasion?.occasionImages?.length > 0 ? (
									<Image
										preview={false}
										src={`${API.OCCASIONS_UPLOADS_URL}${registration.Occasion.occasionImages[0]?.picUrl}`}
										fallback="/no-image.png"
										width="100%"
										className="object-cover rounded-t"
										style={{ padding: '1px' }}
										alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}プログラム画像`}
									/>
								) : (
									<Image
										preview={false}
										src="/no-image.png"
										width="100%"
										className="object-cover"
										style={{ padding: '1px' }}
										alt={`${COMMONS.DEFAULT_SYSTEM_TYPE}画像`}
									/>
								)}
								<p className="px-4 py-2 text-center text-lg font-bold">
									{registration?.Occasion?.title || ''}
								</p>
								{registration?.Occasion?.description ? (
									<p className="whitespace-pre-wrap text-center">
										{registration.Occasion.description}
									</p>
								) : (
									''
								)}
								{registration?.Occasion?.occasionDetails &&
								registration?.Occasion?.occasionDetails?.length > 0 ? (
									<>
										<p
											className="px-4 py-2 text-center text-lg font-bold mt-8 mb-4 rounded"
											style={{
												backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
												color: publicSettings?.PRIMARY_COLOR?.valueString
											}}
										>
											{`${COMMONS.DEFAULT_SYSTEM_TYPE}概要`}
										</p>
										<motion.div
											className="flex flex-col justify-center"
											variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
										>
											<Descriptions
												bordered
												column={1}
												labelStyle={{
													width: '150px',
													whiteSpace: 'pre-wrap',
													fontWeight: 'bold',
													backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
													color: publicSettings?.PRIMARY_COLOR?.valueString
												}}
												size="small"
											>
												{registration?.Occasion.occasionDetails.map((detail) => (
													<Descriptions.Item
														key={detail?.label || ''}
														label={detail?.label || ''}
													>
														<p className="whitespace-pre-wrap font-bold">
															{detail?.value || ''}
														</p>
													</Descriptions.Item>
												))}
											</Descriptions>
										</motion.div>
									</>
								) : (
									''
								)}
							</motion.div>
						</>
					)}
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="flex flex-col mb-8 px-4">
						<div className="flex justify-center mt-4">
							<TapAnimationComponent>
								<Button className="w-32" size="large" onClick={hideRegistrationDetailModal}>
									閉じる
								</Button>
							</TapAnimationComponent>
						</div>
					</motion.div>
				</motion.div>
			</Modal>
		</>
	)
}

export default RegistrationDetailModal
