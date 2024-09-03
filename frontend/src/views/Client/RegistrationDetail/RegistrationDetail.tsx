import { Image, message } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { BaseAnimationComponent, ClientRegistrationDetailComponent } from '@/components'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { encode } from 'base-64'
import QRCode from 'qrcode.react'
import { AxiosError } from 'axios'

const RegistrationDetail = (props) => {
	const { publicSettings, logo, accessToken } = props
	const { registrationId } = useParams()

	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()

	const [registration, setRegistration] = useState(undefined)

	useQuery(
		[API.QUERY_KEY_CLIENT_MY_REGISTRATION_DETAIL, accessToken, registrationId],
		() => API.CLIENT_GET_MY_REGISTRATION_DETAIL(accessToken, registrationId),
		{
			enabled: !!accessToken && !!registrationId,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					setRegistration(response?.data || undefined)
				}
			},
			onError: (error: AxiosError) => {
				if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
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
		}
	)

	return (
		<>
			<BaseAnimationComponent>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial="hidden"
					animate="show"
					exit="hidden"
					className="my-8"
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8">
						{logo ? (
							<Image
								preview={false}
								width={'100%'}
								style={{ maxHeight: '150px' }}
								className="w-full object-contain"
								src={`${API.SETTINGS_UPLOADS_URL}${logo}`}
								fallback="/no-image.png"
							/>
						) : (
							''
						)}
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="my-4 px-4">
						<p
							className="text-center text-lg font-bold"
							style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
						>
							予約が完了しました！
						</p>
						<div className="flex items-center flex-col mt-4">
							<QRCode
								value={registrationId ? encode('H-' + registrationId) : ''}
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
					</motion.div>

					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8 px-4 ">
						<p className="font-bold mb-4 text-base">登録情報</p>

						<ClientRegistrationDetailComponent {...props} registration={registration} />
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8 px-4">
						<p
							className="px-4 py-2 text-center text-sm whitespace-pre-wrap border rounded"
							style={{
								backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
								borderColor: publicSettings?.PRIMARY_COLOR?.valueString
							}}
						>
							{`後で「予約情報」メニューで予約情報を\n見ることができます`}
						</p>
					</motion.div>
				</motion.div>
			</BaseAnimationComponent>
		</>
	)
}

export default RegistrationDetail
