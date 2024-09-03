import { Image, message } from 'antd'
import { API } from '@/utils'
import { COMMONS } from '@/utils'
import { BaseAnimationComponent, ClientHeaderComponent, ClientRegistrationComponent } from '@/components'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { AxiosError } from 'axios'

const Registrations = (props) => {
	const { logo, personalInfo, accessToken } = props

	const queryClient = useQueryClient()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()

	const personalInfoRef = useRef()

	const [registrations, setRegistrations] = useState([])

	useQuery([API.QUERY_KEY_CLIENT_MY_REGISTRATIONS, accessToken], () => API.CLIENT_GET_MY_REGISTRATIONS(accessToken), {
		enabled: !!accessToken,
		onSuccess: (response) => {
			if (isMountedRef.current) {
				setRegistrations(response?.data || [])
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
	})

	useEffect(() => {
		personalInfoRef.current = personalInfo
	}, [personalInfo])

	useEffect(() => {
		const socket = io(API.SITE_URL, { path: API.SOCKET_PATH })

		socket.on(API.SOCKET_REGISTRATION, (response) => {
			if (response !== undefined && Object.keys(response).length !== 0) {
				if (response?.memberId === personalInfoRef.current?.memberId) {
					queryClient.invalidateQueries({
						queryKey: [API.QUERY_KEY_CLIENT_MY_REGISTRATIONS]
					})
				}
			}
		})

		return () => {
			socket.off(API.SOCKET_REGISTRATION)

			socket.disconnect()
		}

		// eslint-disable-next-line
	}, [])

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
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8 flex justify-center">
						{logo ? (
							<Image
								preview={false}
								width={'90%'}
								style={{ maxHeight: '150px' }}
								className="w-full object-contain"
								src={`${API.SETTINGS_UPLOADS_URL}${logo}`}
								fallback="/no-image.png"
							/>
						) : (
							''
						)}
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-4">
						<ClientHeaderComponent {...props} text={`予約情報`} />
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className="mb-8 px-4">
						{/* {registrations.length > 0 && registrations[0] ? ( */}
						{registrations?.map((registration) => (
							<div className="flex flex-col">
								<ClientRegistrationComponent
									{...props}
									key={registration?.registrationId}
									registration={registration}
								/>
							</div>
						))}
						{/* ) : (
              <p className="text-center">予約がありません。</p>
            )} */}
					</motion.div>
				</motion.div>
			</BaseAnimationComponent>
		</>
	)
}

export default Registrations
