import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, Form, Input, message, Divider } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import liff from '@line/liff'
import { motion } from 'framer-motion'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import {
	BaseAnimationComponent,
	// NumericInputComponent,
	TapAnimationComponent,
} from '@/components'
import { AxiosError } from 'axios'
import { processMemberAttributeFormData } from '@/components/common/MemberAttributesForm/MemberAttribute'
// TODO: Clean up since I don't believe we need RegistrationProvider anymore
import { useRegistration, RegistrationProvider } from './RegistrationProvider'
import MemberAttributesForm from '@/components/common/MemberAttributesForm'

const Register = (props) => {
	const { logo, publicSettings } = props
	const { liffId } = useParams()
	const [searchParams] = useSearchParams()
	const campaign = searchParams.get('campaign')

	const navigate = useNavigate()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()

	const [accessToken, setAccessToken] = useState(undefined)
	const [memberAttributes, setMemberAttributes] = useState<MemberAttribute[]>([])

	useQuery(
		[API.QUERY_KEY_CLIENT_PERSONAL_INFO, accessToken],
		() => API.CLIENT_GET_PERSONAL_INFO(accessToken),
		{
			enabled: !!accessToken,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					if (response?.data?.isRegistered) {
						// navigate(`${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}`)
						navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
					}
				}
			},
			onError: (error: AxiosError) => {
				if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
					})
				} else {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
					})
				}
			},
		},
	)

	const registerProfileMutation = useMutation(API.CLIENT_REGISTER_PROFILE, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
				// navigate(
				// 	campaign
				// 		? `${COMMONS.CLIENT_CAMPAIGN_ROUTE}/${liffId}`
				// 		: `${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}`,
				// 	{ replace: true }
				// )
			}
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
				message.warning(COMMONS.ERROR_EMAIL_UNIQUE_MSG)
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			}
		},
	})

	const registerProfileMutationNew = useMutation(API.CLIENT_REGISTER_PROFILE_NEW, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
				// navigate(
				// 	campaign
				// 		? `${COMMONS.CLIENT_CAMPAIGN_ROUTE}/${liffId}`
				// 		: `${COMMONS.CLIENT_CATEGORIES_ROUTE}/${liffId}`,
				// 	{ replace: true }
				// )
			}
		},
		onError: (error: AxiosError) => {
			if (error?.response?.status === COMMONS.RESPONSE_CONFLICT_ERROR) {
				message.warning(COMMONS.ERROR_EMAIL_UNIQUE_MSG)
			} else {
				message.error({
					content: COMMONS.ERROR_SYSTEM_MSG,
					key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
				})
			}
		},
	})

	useEffect(() => {
		try {
			setAccessToken(liff.getAccessToken())
		} catch (err) {
			navigate(`${COMMONS.CLIENT_LOGIN_ROUTE}/${liffId}`)
		}

		// eslint-disable-next-line
	}, [liffId])

	const registerProfileHandler = (data) => {
		// const paramData = {
		//   accessToken: accessToken,
		//   lastName: data.lastName,
		//   firstName: data.firstName,
		//   lastNameKana: data.lastNameKana,
		//   firstNameKana: data.firstNameKana,
		//   postalCode: data.postalCode,
		//   address: data.address,
		//   building: data.building,
		//   telephone: data.telephone,
		//   email: data.email,
		// }

		const formData = processMemberAttributeFormData(data, memberAttributes)
		registerProfileMutationNew.mutate({ accessToken, formData })
	}

	// const uploadProps = {
	//   beforeUpload: () => false,
	//   onChange: handleImageChange,
	// }

	useQuery(
		[API.QUERY_KEY_CLIENT_MEMBER_ATTRIBUTES, accessToken],
		() => API.CLIENT_GET_MEMBER_ATTRIBUTES(accessToken),
		{
			enabled: !!accessToken,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					if (Array.isArray(response?.data)) {
						const dataFilter = response?.data?.filter(
							(item: { isMemberDisplayed: boolean; isAdminDisplayed: boolean }) =>
								item?.isMemberDisplayed && item?.isAdminDisplayed,
						)
						setMemberAttributes(dataFilter || [])
					}
				}
			},
			onError: (error: AxiosError) => {
				if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
					})
				} else {
					message.error({
						content: COMMONS.ERROR_SYSTEM_MSG,
						key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
					})
				}
			},
		},
	)

	return (
		<RegistrationProvider>
			<BaseAnimationComponent>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial='hidden'
					animate='show'
					exit='hidden'
					className='py-8'
				>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
						className='flex justify-center'
					>
						{logo ? (
							<img
								style={{
									maxHeight: '150px',
								}}
								alt='ロゴ'
								src={`${API.SETTINGS_UPLOADS_URL}${logo}`}
								className='rounded max-w-full object-contain'
							/>
						) : (
							<img
								style={{
									maxHeight: '150px',
								}}
								alt='ロゴ'
								src='/logo.svg'
								className='rounded max-w-full object-contain'
							/>
						)}
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='mt-4'>
						<p
							className='text-center text-2xl font-bold w-full border-b border-dashed py-4 px-6 mb-8'
							style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
						>
							{campaign ? 'キャンペーン応募' : 'お客様情報登録'}
						</p>
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='my-8'>
						<p className='text-center text-base font-bold'>
							下記内容についてご登録ください
						</p>
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='mb-8'>
						<MemberAttributesForm
							personalInfo={{}}
							memberAttributes={memberAttributes}
							formHandler={registerProfileHandler}
							formMutation={registerProfileMutation}
							submitBtnOptions={{
								submitBtnText: '登録する',
								submitBtnClassName: 'w-full h-12',
							}}
						/>
					</motion.div>
				</motion.div>
			</BaseAnimationComponent>
		</RegistrationProvider>
	)
}

export default Register
