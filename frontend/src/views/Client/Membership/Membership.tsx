import { useQuery } from '@tanstack/react-query'
import { Descriptions, Image, message } from 'antd'
import { COMMONS } from '@/utils'
import { BaseAnimationComponent, ClientTopBarComponent, TapAnimationComponent } from '@/components'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Barcode from 'react-barcode'
import { API } from '@/utils'
import moment from 'moment'
import dayjs from 'dayjs'
import { AxiosError } from 'axios'
import { useLayoutConfigContext } from '@/providers/layoutConfig.provider'

const PencilSvg = ({ className }) => (
	<svg
		x='0px'
		y='0px'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		className={className}
		fill='currentColor'
	>
		<path d='M19.769 9.923l-12.642 12.639-7.127 1.438 1.438-7.128 12.641-12.64 5.69 5.691zm1.414-1.414l2.817-2.82-5.691-5.689-2.816 2.817 5.69 5.692z' />
	</svg>
)

const Membership = (props) => {
	const { personalInfo, accessToken, isMountedRef } = props
	const { publicSettings } = useLayoutConfigContext()
	const { liffId } = useParams()
	const [memberAttributes, setMemberAttributes] = useState<
		Array<MemberAttribute & { value: string }>
	>([])

	useQuery(
		[API.QUERY_KEY_CLIENT_MEMBER_ATTRIBUTES, accessToken],
		() => API.CLIENT_GET_MEMBER_ATTRIBUTES(accessToken),
		{
			enabled: !!accessToken,
			onSuccess: (response) => {
				if (isMountedRef.current) {
					if (Array.isArray(response?.data)) {
						updateMembershipPersonalInfo(response.data)
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

	const updateMembershipPersonalInfo = (updatedMemberAttributes: MemberAttribute[]) => {
		const dataFilter = updatedMemberAttributes.filter(
			(item: { isMemberDisplayed: boolean; isAdminDisplayed: boolean }) =>
				item?.isMemberDisplayed && item?.isAdminDisplayed,
		)
		const dataMemberAttributes = dataFilter.map((item) => {
			return {
				...item,
				value: personalInfo?.[`memberAttributeId${item?.memberAttributeId}`],
			}
		})

		setMemberAttributes(dataMemberAttributes.filter((item) => item))
	}

	// TODO: Refactor into shared component helper for admin DetailModal.tsx
	const handleMemberAttributes = (item, index) => {
		if (
			item?.type === 'text' ||
			item?.type === 'textarea' ||
			item?.type === 'url' ||
			item?.type === 'number_integer' ||
			item?.type === 'number_float' ||
			// item?.type === 'boolean' ||
			item?.type === 'radio' ||
			item?.type === 'time' ||
			item?.type === 'checkbox' ||
			item?.type === 'email' ||
			item?.type === 'telephone' ||
			item?.type === 'firstName' ||
			item?.type === 'lastName' ||
			item?.type === 'firstNameKana' ||
			item?.type === 'lastNameKana'
		) {
			return (
				<Descriptions.Item
					className='text-sm font-bold'
					label={item?.label}
					key={`membershipItem${index}`}
				>
					<p className='text-sm font-bold'>{item.value || 'ー'}</p>
				</Descriptions.Item>
			)
		}
		if (
			item?.type === 'address_postal'
			// item?.type === 'address_city' ||
			// item?.type === 'address_address' ||
			// item?.type === 'address_building'
		) {
			const addressStr = COMMONS.generateMemberAttributeAddressStr({
				member: personalInfo,
				memberAttributes,
				addrGroupSection: item.section,
			})
			return (
				<Descriptions.Item
					className='text-sm font-bold'
					label={item?.label}
					key={`membershipItem${index}`}
				>
					<p className='text-sm font-bold'>{addressStr || 'ー'}</p>
				</Descriptions.Item>
			)
		}
		if (item?.type === 'date') {
			return (
				<Descriptions.Item
					className='text-sm font-bold'
					label={item?.label}
					key={`membershipItem${index}`}
				>
					<p className='text-sm font-bold'>
						{item.value ? dayjs(item.value).format('YYYY年M月D日') : 'ー'}
					</p>
				</Descriptions.Item>
			)
		}
		if (item?.type === 'select') {
			return (
				<Descriptions.Item
					className='text-sm font-bold'
					label={item?.label}
					key={`membershipItem${index}`}
				>
					<p className='text-sm font-bold'>{item.value || 'ー'}</p>
				</Descriptions.Item>
			)
		}
		if (item?.type === 'datetime') {
			return (
				<Descriptions.Item
					className='text-sm font-bold'
					label={item?.label}
					key={`membershipItem${index}`}
				>
					<p className='text-sm font-bold'>
						{item.value ? dayjs(item.value).format('YYYY年M月D日 HH:mm') : 'ー'}
					</p>
				</Descriptions.Item>
			)
		}
		// if (item?.type === 'color') {
		// 	return (
		// 		<Descriptions.Item className="text-sm font-bold" label={item?.label} key={`membershipItem${index}`}>
		// 			<div
		// 				style={{
		// 					backgroundColor: item.value,
		// 					width: '50px',
		// 					height: '50px',
		// 					border: '1px solid #000'
		// 				}}
		// 			></div>
		// 		</Descriptions.Item>
		// 	)
		// }
		if (item?.type === 'image') {
			return (
				<Descriptions.Item
					className='text-sm font-bold'
					label={item?.label}
					key={`membershipItem${index}`}
				>
					{item.value ? (
						<Image
							preview={true}
							className='w-20 h-20'
							src={
								API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(item.memberAttributeId) +
								`/${item.value}`
							}
						/>
					) : (
						<Image preview={true} className='w-20 h-20' src='/no-image.png' />
					)}
				</Descriptions.Item>
			)
		}
		if (item?.type === 'video') {
			return (
				<Descriptions.Item
					className='text-sm font-bold'
					label={item?.label}
					key={`membershipItem${index}`}
				>
					{item.value ? (
						<video width='320' height='240' controls>
							<source
								src={
									API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(
										item.memberAttributeId,
									) + `/${item.value}`
								}
							/>
							Your browser does not support the video tag.
						</video>
					) : (
						<p>動画がありません</p>
					)}
				</Descriptions.Item>
			)
		}
		if (item?.type === 'file') {
			return (
				<Descriptions.Item
					className='text-sm font-bold'
					label={item?.label}
					key={`membershipItem${index}`}
				>
					{item.value ? (
						<a
							href={
								API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(item.memberAttributeId) +
								`/${item.value}`
							}
							download
						>
							{item.value}
						</a>
					) : (
						<p>ファイルがありません</p>
					)}
				</Descriptions.Item>
			)
		}
	}

	// Update displayed customer registeration and personal info when parent component still fetching personalInfo and
	// hasn't passed down latest props
	useEffect(() => {
		updateMembershipPersonalInfo(memberAttributes)
	}, [personalInfo])

	const MemberBarCodeComponent = () =>
		publicSettings?.BARCODE_ENABLED?.valueFlag ? (
			<div
				className='rounded-lg border border-solid shadow mt-4'
				style={{
					borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
					color: publicSettings?.PRIMARY_COLOR?.valueString,
				}}
			>
				<div className='flex flex-col p-4'>
					<span className='text-base pb-2'>会員番号</span>
					<div className='flex justify-center'>
						<Barcode
							value={personalInfo?.memberCode || '000000000000000'}
							displayValue={false}
							height={80}
							width={2}
							margin={0}
						/>
					</div>
					<p className='text-center text-sm text-black'>
						ID: {personalInfo?.memberCode || '000000000000000'}
					</p>
				</div>
			</div>
		) : (
			<></>
		)

	const infoItems = [
		// MemberExpiryDateItem
		{
			enabled: publicSettings?.DATE_OF_EXPIRY_ENABLED?.valueFlag,
			label: '有効期限',
			value: personalInfo?.activeUntil
				? dayjs(personalInfo?.activeUntil).format('YYYY年M月D日')
				: 'ー',
		},
		// MemberPointItem
		{
			enabled: publicSettings?.POINTS_ENABLED?.valueFlag,
			label: 'ポイント',
			value: personalInfo?.kakeruPoint || '0',
			valueLabel: 'pt',
		},
	].filter((item) => item.enabled) // Filter now so we don't have to perform additional checks later
	const getInfoItemComponent = (
		{
			label,
			value,
			valueLabel,
		}: {
			label: string
			value: string
			valueLabel?: string
		},
		itemIndex: number,
	) => (
		<div
			className={`flex justify-between items-center text-base ${
				infoItems.length > 1 && itemIndex != infoItems.length - 1 ? 'mb-2' : ''
			}`}
		>
			<p className='whitespace-pre-wrap'>{label}</p>
			<p className=''>
				<span className='font-bold'>{value}</span>
				<span className='text-sm'>{valueLabel}</span>
			</p>
		</div>
	)

	const MemberInfoComponent = () => {
		const hasEnabledInfoSetting = [
			publicSettings?.DATE_OF_EXPIRY_ENABLED?.valueFlag,
			publicSettings?.POINTS_ENABLED?.valueFlag,
		].some((setting) => setting)
		return hasEnabledInfoSetting ? (
			<div
				className='rounded-lg border border-solid shadow mt-4'
				style={{
					borderColor: publicSettings?.PRIMARY_COLOR.valueString,
					color: publicSettings?.PRIMARY_COLOR.valueString,
					backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
				}}
			>
				<div className='flex flex-col p-4'>
					{infoItems.map(getInfoItemComponent)}
					{/* <div className="flex justify-between items-center mt-4">
						<p className="whitespace-pre-wrap">{`来店回数`}</p>
						<p className="text-2xl">
							<span className="font-bold">{personalInfo?.countVisit || '0'}</span>
							<span className="text-sm">回</span>
						</p>
					</div> */}
				</div>
			</div>
		) : (
			<></>
		)
	}

	const MemberAttributeInfoItems = () =>
		memberAttributes.length !== 0 && (
			<Descriptions
				column={1}
				labelStyle={{ width: '135px' }}
				contentStyle={{ padding: '1rem' }}
				bordered
			>
				{memberAttributes.map(handleMemberAttributes)}
			</Descriptions>
		)

	return (
		<>
			<BaseAnimationComponent>
				<motion.div
					variants={COMMONS.ANIMATION_VARIANT_STAGGER_CONTAINER}
					initial='hidden'
					animate='show'
					exit='hidden'
					className='my-8'
				>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
						<ClientTopBarComponent {...props} />
						<p
							className='text-center text-2xl font-bold w-full border-b border-dashed py-4 px-6 mt-8'
							style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
						>
							お客様情報
						</p>
					</motion.div>
					<motion.div
						variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
						className='my-8 px-4'
					>
						<div
							className='rounded-lg border shadow p-4'
							style={{
								backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString,
								borderColor: publicSettings?.PRIMARY_COLOR?.valueString,
								color: publicSettings?.PRIMARY_COLOR?.valueString,
							}}
						>
							<div className='flex justify-center mb-2'>
								{personalInfo?.picUrl ? (
									<Image
										preview={false}
										className='rounded-full w-20 h-20'
										style={{
											border: `2px solid ${publicSettings?.PRIMARY_COLOR?.valueString}`,
										}}
										src={`${personalInfo.picUrl}`}
										fallback='/no-image.png'
									/>
								) : (
									<Image
										preview={false}
										className='rounded-full w-20 h-20'
										style={{
											border: `2px solid ${publicSettings?.PRIMARY_COLOR?.valueString}`,
										}}
										src='/no-image.png'
									/>
								)}
							</div>
							<MemberAttributeInfoItems />
							{/* <p className="text-center text-2xl text-black font-bold">
                {`${personalInfo?.lastName || ""} ${
                  personalInfo?.firstName || ""
                } 様`}
              </p>
              <p className="text-center text-sm font-bold mb-4">
                （
                {`${personalInfo?.lastNameKana || ""} ${
                  personalInfo?.firstNameKana || ""
                }`}
                ）
              </p>
              <div className="flex justify-center">
                <div className="flex flex-col text-black">
                  <div className="flex">
                    <div className="flex-none w-32">
                      <p className="text-sm font-bold text-right">電話番号：</p>
                    </div>
                    <div className="flex-1 ml-2">
                      <p className="text-sm">
                        {personalInfo?.telephone || "ー"}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-none w-32">
                      <p className="text-sm font-bold text-right">
                        メールアドレス：
                      </p>
                    </div>
                    <div className="flex-1 ml-2">
                      <p className="text-sm">{personalInfo?.email || "ー"}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-none w-32">
                      <p className="text-sm font-bold text-right">住所：</p>
                    </div>
                    <div className="flex-1 ml-2">
                      <p className="text-sm">{`〒${
                        personalInfo?.postalCode
                          ? COMMONS.POSTAL_CODE_INSERT_CHARACTER(
                              personalInfo.postalCode,
                              3,
                              "-"
                            )
                          : "ー"
                      } ${personalInfo?.address || "ー"}${
                        personalInfo?.building || "ー"
                      }`}</p>
                    </div>
                  </div>
                </div>
              </div> */}
						</div>

						<motion.div
							variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
							className='mt-4 px-4 flex flex-col'
						>
							<div className='flex justify-between items-center text-base'>
								<p className='whitespace-pre-wrap'>会員登録</p>
								<p className=''>
									{dayjs(personalInfo?.memberSince).format('YYYY年M月D日')}
								</p>
							</div>
						</motion.div>
						<MemberBarCodeComponent />
						<MemberInfoComponent />
					</motion.div>
					<motion.div variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM} className='px-4'>
						<div className='flex justify-center'>
							<TapAnimationComponent>
								<Link
									to={`${COMMONS.CLIENT_PROFILE_UPDATE_ROUTE}/${liffId}`}
									className='text-base text-black font-bold'
								>
									<p className='border-b border-solid'>
										<span>
											<PencilSvg className='mr-2' />
										</span>
										<span className='text-lg'>お客様情報を編集する</span>
									</p>
								</Link>
							</TapAnimationComponent>
						</div>
					</motion.div>
				</motion.div>
			</BaseAnimationComponent>
		</>
	)
}

export default Membership
