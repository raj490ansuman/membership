import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Input, message, Divider } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { COMMONS } from '@/utils'
import { API } from '@/utils'
import {
	BaseAnimationComponent,
	// NumericInputComponent,
	TapAnimationComponent,
} from '@/components'

import { AxiosError } from 'axios'

// const { TextArea } = Input

import { processMemberAttributeFormData } from '@/components/common/MemberAttributesForm/MemberAttribute'
import MemberAttributesForm from '@/components/common/MemberAttributesForm'

const ProfileUpdate = (props) => {
	const { publicSettings, personalInfo, accessToken } = props
	const { liffId } = useParams()

	const navigate = useNavigate()
	const isMountedRef = COMMONS.USE_IS_MOUNTED_REF()
	const queryClient = useQueryClient()
	const [memberAttributes, setMemberAttributes] = useState<MemberAttribute[]>([])

	const updateProfileMutation = useMutation(API.CLIENT_UPDATE_PROFILE, {
		onSuccess: (response) => {
			if (isMountedRef.current) {
				message.success(COMMONS.SUCCESS_UPDATE_MSG)
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_CLIENT_PERSONAL_INFO],
				})
				navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
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
				queryClient.invalidateQueries({
					queryKey: [API.QUERY_KEY_CLIENT_PERSONAL_INFO],
				})
				navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
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

	const updateProfileHandler = (data) => {
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

		// updateProfileMutation.mutate(paramData)

		// TODO: We should not be uploading images that remain the same
		const formData = processMemberAttributeFormData(data, memberAttributes)
		registerProfileMutationNew.mutate({ accessToken, formData })
	}

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

	// useQuery(
	//   [API.QUERY_KEY_CLIENT_CUSTOMER_REGISTRATIONS, accessToken],
	//   () => API.CLIENT_GET_CUSTOMER_REGISTRATIONS(accessToken),
	//   {
	//     enabled: !!accessToken,
	//     onSuccess: (response) => {
	//       if (isMountedRef.current) {
	//         if (Array.isArray(response?.data)) {
	//           const dataFilter = response?.data.filter(
	//             (item) => item?.isDisplayed
	//           )
	//           setMemberAttributes(dataFilter || [])
	//         }
	//       }
	//     },
	//     onError: (error: AxiosError) => {
	//       if (error?.response?.status === COMMONS.RESPONSE_SYSTEM_ERROR) {
	//         message.error({
	//           content: COMMONS.ERROR_SYSTEM_MSG,
	//           key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
	//         })
	//       } else {
	//         message.error({
	//           content: COMMONS.ERROR_SYSTEM_MSG,
	//           key: COMMONS.MESSAGE_SYSTEM_ERROR_KEY,
	//         })
	//       }
	//     },
	//   }
	// )

	return (
		<>
			<BaseAnimationComponent>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial='hidden'
					animate='show'
					exit='hidden'
					className='py-8'
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='px-4'>
						<TapAnimationComponent>
							<Button
								type='primary'
								icon={<ArrowLeftOutlined />}
								size='large'
								className='rounded-full'
								onClick={() => {
									navigate(`${COMMONS.CLIENT_MEMBERSHIP_ROUTE}/${liffId}`)
								}}
							>
								戻る
							</Button>
						</TapAnimationComponent>
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='mt-4'>
						<p
							className='text-center text-2xl font-bold w-full border-b border-dashed py-4 px-6 mb-8'
							style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
						>
							お客様情報編集
						</p>
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='mb-8'>
						<MemberAttributesForm
							personalInfo={personalInfo}
							memberAttributes={memberAttributes}
							formHandler={updateProfileHandler}
							formMutation={updateProfileMutation}
						/>
					</motion.div>
				</motion.div>
			</BaseAnimationComponent>
		</>
	)
}

export default ProfileUpdate
