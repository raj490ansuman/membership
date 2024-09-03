/* eslint-disable react-refresh/only-export-components */
import {
	Button,
	Form,
	Input,
	DatePicker,
	TimePicker,
	Checkbox,
	Select,
	Radio,
	Upload,
	InputNumber,
	message,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { API, COMMONS } from '@/utils'
import jaJP from 'antd/lib/date-picker/locale/ja_JP'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import TextArea from 'antd/es/input/TextArea'
import { NumericInputComponent } from '@/components'

const validateURL = (_, value) => {
	if (!value || /^(ftp|http|https):\/\/[^ "]+$/.test(value)) {
		return Promise.resolve()
	}
	return Promise.reject(new Error('有効なURLを入力してください'))
}
const MemberAttributeTextInput = ({
	item,
	initialValue,
	hideInputLabel = false,
	placeholderText = item?.label,
}: {
	item: MemberAttribute | undefined
	initialValue?: string
	hideInputLabel?: boolean
	placeholderText?: string
}) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				(!hideInputLabel || item?.required) && (
					<p>
						{!hideInputLabel && <span className='font-bold'>{`${item?.label}`}</span>}
						{item?.required && <span className='custom-required-decoration'>必須</span>}
					</p>
				)
			}
			rules={[
				{
					required: item?.required,
					message: `${item?.label}を入力してください`,
				},
			]}
		>
			<Input className='w-full' placeholder={placeholderText} allowClear />
		</Form.Item>
	</motion.div>
)

const MemberAttributeTextareaInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<TextArea className='w-full' placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

// const MemberAttributeColorInput = ({ item, initialValue }) => (
// 	<motion.div className="px-6 mb-0" key={item?.memberAttributeId} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
// 		<Form.Item
// 			name={`memberAttributeId${item?.memberAttributeId}`}
// 			initialValue={initialValue ? initialValue : ''}
// 			label={
// 				<p>
// 					<span className="font-bold">{`${item?.label}`}</span>
// 					{item?.required && <span className="custom-required-decoration">必須</span>}
// 				</p>
// 			}
// 			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
// 		>
// 			<Input type="color" className="w-full" placeholder={item?.label} />
// 		</Form.Item>
// 	</motion.div>
// )

const MemberAttributeUrlInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[
				{ required: item?.required, message: `${item?.label}を入力してください` },
				{ validator: validateURL },
			]}
		>
			<Input type='url' className='w-full' placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

const MemberAttributeNumberIntegerInput = ({ item, initialValue }) => (
	<motion.div
		key={item?.memberAttributeId}
		className='px-6 mb-0'
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<InputNumber changeOnWheel={false} className='w-full' placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

const MemberAttributeNumberFloatInput = ({ item, initialValue }) => (
	<motion.div
		key={item?.memberAttributeId}
		className='px-6 mb-0'
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<InputNumber className='w-full' placeholder={item?.label} step='0.01' />
		</Form.Item>
	</motion.div>
)

// const MemberAttributeBooleanInput = ({ item, initialValue }) => (
// 	<motion.div className="px-6 mb-0" key={item?.memberAttributeId} variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
// 		<Form.Item
// 			name={`memberAttributeId${item?.memberAttributeId}`}
// 			initialValue={initialValue}
// 			label={
// 				<p>
// 					<span className="font-bold">{`${item?.label}`}</span>
// 					{item?.required && <span className="custom-required-decoration">必須</span>}
// 				</p>
// 			}
// 			valuePropName="checked"
// 		>
// 			<Checkbox />
// 		</Form.Item>
// 	</motion.div>
// )

const MemberAttributeSelectInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item.memberAttributeId}`}
			initialValue={initialValue}
			label={
				<p>
					<span className='font-bold'>{item.label}</span>
					{item.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item.required, message: `${item.label}を入力してください` }]}
		>
			<Select>
				{item.attributeChoices?.map((choice) => (
					<Select.Option key={choice.attributeChoiceId} value={choice.contents}>
						{choice.contents}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	</motion.div>
)
const MemberAttributePrefectureSelectInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item.memberAttributeId}`}
			initialValue={initialValue}
			className={item?.required ? 'mb-1' : ''}
			label={
				item.required && (
					<p>
						<span className='custom-required-decoration'>必須</span>
					</p>
				)
			}
			rules={[{ required: item.required, message: `${item.label}を入力してください` }]}
		>
			<Select placeholder='都道府県' allowClear>
				{item.attributeChoices?.map((choice) => (
					<Select.Option key={choice.attributeChoiceId} value={choice.contents}>
						{choice.contents}
					</Select.Option>
				))}
				{COMMONS.PREFECTURES.map((prefecture) => (
					<Select.Option key={prefecture.value} value={prefecture.label}>
						{prefecture.label}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	</motion.div>
)

const MemberAttributeDateTimeInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? dayjs(initialValue) : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<DatePicker showTime locale={jaJP} format='YYYY-MM-DD HH:mm' />
		</Form.Item>
	</motion.div>
)

const MemberAttributeTimeInput = ({ item, initialValue }) => {
	const formattedInitialValue = initialValue ? dayjs(initialValue, 'HH:mm') : null

	return (
		<motion.div
			className='px-6 mb-0'
			key={item?.memberAttributeId}
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
		>
			<Form.Item
				name={`memberAttributeId${item?.memberAttributeId}`}
				initialValue={formattedInitialValue}
				label={
					<p>
						<span className='font-bold'>{`${item?.label}`}</span>
						{item?.required && <span className='custom-required-decoration'>必須</span>}
					</p>
				}
				rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
			>
				<TimePicker locale={jaJP} format='HH:mm' />
			</Form.Item>
		</motion.div>
	)
}
const MemberAttributeNumberInput = ({
	item,
	initialValue,
}: {
	item: MemberAttribute
	initialValue?: string
}) => (
	<motion.div
		key={item?.memberAttributeId}
		className='px-6 mb-0'
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[
				{
					required: item?.required,
					message: `${item?.label}を入力してください`,
				},
			]}
		>
			<Input type='number' className='w-full' allowClear placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

const MemberAttributeDatePickerInput = ({
	item,
	initialValue,
}: {
	item: MemberAttribute
	initialValue?: string
}) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? dayjs(initialValue) : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[
				{
					required: item?.required,
					message: `${item?.label}を入力してください`,
				},
			]}
		>
			<DatePicker locale={jaJP} format='YYYY-MM-DD' />
		</Form.Item>
	</motion.div>
)

const MemberAttributeCheckboxInput = ({
	item,
	initialValue,
}: {
	item: MemberAttribute
	initialValue?: string
}) => {
	const initialValues = initialValue ? initialValue.split(',') : []

	return (
		<motion.div
			className='px-6 mb-0'
			key={item?.memberAttributeId}
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
		>
			<Form.Item
				name={`memberAttributeId${item?.memberAttributeId}`}
				initialValue={initialValues}
				label={
					<p>
						<span className='font-bold'>{`${item?.label}`}</span>
						{item?.required && <span className='custom-required-decoration'>必須</span>}
					</p>
				}
				rules={[
					{
						required: item?.required,
						message: `${item?.label}を入力してください`,
					},
				]}
			>
				{item?.attributeChoices?.length && item?.attributeChoices?.length > 0 && (
					<Checkbox.Group
						options={item?.attributeChoices?.map((i) => ({
							label: i.contents,
							value: i.contents,
						}))}
					/>
				)}
			</Form.Item>
		</motion.div>
	)
}
const MemberAttributeRadioInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item.memberAttributeId}`}
			initialValue={initialValue}
			label={
				<p>
					<span className='font-bold'>{item.label}</span>
					{item.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item.required, message: `${item.label}を入力してください` }]}
		>
			<Radio.Group>
				{item.attributeChoices?.map((choice) => (
					<Radio key={choice.attributeChoiceId} value={choice.contents}>
						{choice.contents}
					</Radio>
				))}
			</Radio.Group>
		</Form.Item>
	</motion.div>
)

const MemberAttributeAudioInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<Upload beforeUpload={() => false} accept='audio/*' maxCount={1}>
				<Button icon={<UploadOutlined />}>オーディオファイルをアップロード</Button>
			</Upload>
		</Form.Item>
	</motion.div>
)

const MemberAttributeVideoInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<Upload beforeUpload={() => false} accept='video/*' maxCount={1}>
				<Button icon={<UploadOutlined />}>ビデオファイルをアップロード</Button>
			</Upload>
		</Form.Item>
	</motion.div>
)

const MemberAttributeFileInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<Upload beforeUpload={() => false} accept='*' maxCount={1}>
				<Button icon={<UploadOutlined />}>アップロード</Button>
			</Upload>
		</Form.Item>
	</motion.div>
)

const MemberAttributeImageInput = ({
	item,
	initialValue,
}: {
	item: MemberAttribute
	initialValue?: string
}) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const parentForm = Form.useFormInstance()

	useEffect(() => {
		async function initializeUpload() {
			if (initialValue) {
				const slice = initialValue?.slice(initialValue.lastIndexOf('.') + 1)
				const imageFile = await urlToFile(
					API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(item.memberAttributeId) +
						`/${initialValue}`,
					initialValue,
					`image/${slice}`,
				)
				setFileList((existingFileList) => [
					...existingFileList,
					{
						uid: String(item.memberAttributeId),
						percent: 50,
						name: initialValue,
						url:
							API.GET_CUSTOM_REGISTRATION_UPLOAD_PATH(item.memberAttributeId) +
							`/${initialValue}`,
					},
				])
				parentForm.setFieldValue(`memberAttributeId${item?.memberAttributeId}`, imageFile)
			}
		}

		initializeUpload()
	}, [initialValue])

	// TODO: Relocate to file utilities
	const urlToFile = async (url: string, fileName: string, mimeType: string) => {
		const response = await fetch(url)
		const blob = await response.blob()

		return new File([blob], fileName, { type: mimeType })
	}

	const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = (error) => reject(error)
		})

	const normFile = (eventArgs: {
		file: UploadFile<unknown>
		fileList: UploadFile<unknown>[]
	}) => {
		if (eventArgs?.file?.status === 'removed') {
			return
		}
		return eventArgs.file
	}
	const handleImageChange = async (
		eventArgs: UploadChangeParam<UploadFile<unknown>>,
		id: string,
	) => {
		if (!eventArgs?.file?.url) {
			const url = await getBase64(eventArgs?.file as unknown as File)
			const index = fileList?.findIndex((i) => i.uid === id)
			const objectFile: UploadFile<unknown> = {
				uid: id,
				percent: 50,
				name: eventArgs?.file?.name,
				url: typeof url === 'string' ? url : '',
			}
			const arrFile = [...fileList]
			// Check if we need to replace or just add to empty list
			if (!fileList || index !== -1) {
				arrFile?.splice(index, 1, objectFile)
			} else {
				arrFile?.push(objectFile)
			}
			setFileList(arrFile)
		}
	}
	return (
		<motion.div
			key={item?.memberAttributeId}
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
			className='px-6 mb-0'
		>
			<Form.Item
				name={`memberAttributeId${item?.memberAttributeId}`}
				label={
					<p>
						<span className='font-bold'>{`${item?.label}`}</span>
						{item?.required && <span className='custom-required-decoration'>必須</span>}
					</p>
				}
				rules={[
					{
						required: item?.required,
						message: `${item?.label}を入力してください`,
					},
				]}
				getValueFromEvent={normFile}
			>
				<Upload
					fileList={fileList}
					accept='.jpg,.jpeg,.png'
					beforeUpload={() => false}
					onChange={(eventArgs: {
						file: UploadFile<unknown>
						fileList: UploadFile<unknown>[]
					}) => handleImageChange(eventArgs, item?.memberAttributeId)}
					onRemove={(e) => {
						setFileList(fileList?.filter((i) => i.uid !== e.uid))
					}}
					maxCount={1}
					listType='picture'
				>
					<Button icon={<UploadOutlined />}>Click to upload</Button>
				</Upload>
			</Form.Item>
		</motion.div>
	)
}

const MemberAttributeEmailInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[
				{ required: item?.required, message: `${item?.label}を入力してください` },
				{ type: 'email', message: '有効なメールアドレスを入力してください' },
			]}
		>
			<Input type='email' className='w-full' placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

// Custom Registration Telephone Input
const MemberAttributeTelephoneInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[
				{
					pattern: /^(?:\d{10,11}|\d{3}-\d{3,4}-\d{4}|\d{3}-\d{4}-\d{4})$/,
					message: '例：111-222-3333',
				},
			]}
		>
			<Input className='w-full' placeholder='例：111-222-3333' />
		</Form.Item>
	</motion.div>
)

// Custom Registration First Name Input
const MemberAttributeFirstNameInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<Input className='w-full' placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

// Custom Registration Last Name Input
const MemberAttributeLastNameInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[{ required: item?.required, message: `${item?.label}を入力してください` }]}
		>
			<Input className='w-full' placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

// Custom Registration First Name Kana Input
const MemberAttributeFirstNameKanaInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[
				{ required: item?.required, message: `${item?.label}を入力してください` },
				{ pattern: /^[ァ-ヶー　]*$/, message: '有効なカタカナを入力してください' },
			]}
		>
			<Input className='w-full' placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

// Custom Registration Last Name Kana Input
const MemberAttributeLastNameKanaInput = ({ item, initialValue }) => (
	<motion.div
		className='px-6 mb-0'
		key={item?.memberAttributeId}
		variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
	>
		<Form.Item
			name={`memberAttributeId${item?.memberAttributeId}`}
			initialValue={initialValue ? initialValue : ''}
			label={
				<p>
					<span className='font-bold'>{`${item?.label}`}</span>
					{item?.required && <span className='custom-required-decoration'>必須</span>}
				</p>
			}
			rules={[
				{ required: item?.required, message: `${item?.label}を入力してください` },
				{ pattern: /^[ァ-ヶー　]*$/, message: '有効なカタカナを入力してください' },
			]}
		>
			<Input className='w-full' placeholder={item?.label} />
		</Form.Item>
	</motion.div>
)

const MemberAttributeAddressPostalInput = ({
	item,
	initialValue,
	memberAttributes,
}: {
	item: MemberAttribute
	initialValue?: string
	memberAttributes: MemberAttribute[]
}) => {
	const parentForm = Form.useFormInstance()
	const addressGroupSection = item?.section

	const postalSearchHandler = async () => {
		const postalCode = parentForm?.getFieldValue(`memberAttributeId${item?.memberAttributeId}`)
		if (String(postalCode).length !== 7) return

		const postalCodeText = await API.GET_ADDRESS_BY_POSTAL_CODE(postalCode)
		const matcher = postalCodeText?.match(/({".*"]})/)

		if (matcher) {
			// { postalCode: [number, ward, street], ... }
			const postalAddresses = JSON.parse(matcher[0])
			const addressChunks = postalAddresses[postalCode]
			const [prefectureIndex, addressCity, address, addressBuilding] = addressChunks

			if (addressCity && address) {
				// Auto fill same section prefecture
				const prefectureName = COMMONS.PREFECTURES[prefectureIndex - 1]['label']
				const memberAttributePrefecture = COMMONS.findMemberAttributeBy({
					type: 'address_prefecture',
					section: addressGroupSection,
					memberAttributes,
				})
				parentForm?.setFieldValue(
					`memberAttributeId${memberAttributePrefecture?.memberAttributeId}`,
					prefectureName,
				)

				// Auto fill same section city
				const memberAttributeCity = COMMONS.findMemberAttributeBy({
					type: 'address_city',
					section: addressGroupSection,
					memberAttributes,
				})
				parentForm?.setFieldValue(
					`memberAttributeId${memberAttributeCity?.memberAttributeId}`,
					addressCity,
				)

				// Auto fill same section address
				const memberAttributeAddress = COMMONS.findMemberAttributeBy({
					type: 'address_address',
					section: addressGroupSection,
					memberAttributes,
				})
				parentForm?.setFieldValue(
					`memberAttributeId${memberAttributeAddress?.memberAttributeId}`,
					address,
				)

				// Auto fill same section address
				const memberAttributeAddressBldg = COMMONS.findMemberAttributeBy({
					type: 'address_building',
					section: addressGroupSection,
					memberAttributes,
				})
				parentForm?.setFieldValue(
					`memberAttributeId${memberAttributeAddressBldg?.memberAttributeId}`,
					addressBuilding,
				)
			} else {
				message.warning(COMMONS.WARN_POSTAL_CODE_WRONG_MSG)
			}
		}
	}

	return (
		<motion.div
			className='px-6 mb-0'
			key={item?.memberAttributeId}
			variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
		>
			<Form.Item
				name={`memberAttributeId${item?.memberAttributeId}`}
				initialValue={initialValue}
				className={item?.required ? 'mb-1' : ''}
				label={
					item?.required && (
						<p>
							<span className='custom-required-decoration'>必須</span>
						</p>
					)
				}
				rules={[
					{
						required: item?.required,
						message: `${item?.label}を入力してください`,
					},
					{
						whitespace: true,
						message: '有効な郵便番号を入力してください',
					},
					{
						len: 7,
						message: '',
					},
				]}
			>
				<NumericInputComponent
					placeholder='郵便番号（例：5670000）'
					maxLength={7}
					allowClear
					onPressEnter={(e: Event) => {
						e.preventDefault()
						postalSearchHandler()
					}}
					onChange={postalSearchHandler}
					pattern='[0-9]*'
					inputMode='numeric'
				/>
			</Form.Item>
		</motion.div>
	)
}

export const MemberAttributeAddressInputGroup = ({
	member,
	memberAttributes,
	memberAttributePostalCode,
}: {
	member: Record<string, unknown>
	memberAttributes: MemberAttribute[]
	memberAttributePostalCode: MemberAttribute
}) => {
	const addressGroupSection = memberAttributePostalCode?.section
	const sectionAttributes = { section: addressGroupSection, memberAttributes }

	// Get member address attributes
	const addressPrefecture = COMMONS.findMemberAttributeBy({
		type: 'address_prefecture',
		...sectionAttributes,
	})
	const addressCity = COMMONS.findMemberAttributeBy({
		type: 'address_city',
		...sectionAttributes,
	})
	const addressAddress = COMMONS.findMemberAttributeBy({
		type: 'address_address',
		...sectionAttributes,
	})
	const addressBuilding = COMMONS.findMemberAttributeBy({
		type: 'address_building',
		...sectionAttributes,
	})

	// Get member address values and set as default values
	const addressPostalInitialValue = member?.[
		`memberAttributeId${memberAttributePostalCode?.memberAttributeId}`
	] as string
	const addressPrefectureInitialValue = member?.[
		`memberAttributeId${addressPrefecture?.memberAttributeId}`
	] as string
	const addressCityInitialValue = member?.[
		`memberAttributeId${addressCity?.memberAttributeId}`
	] as string
	const addressAddressInitialValue = member?.[
		`memberAttributeId${addressAddress?.memberAttributeId}`
	] as string
	const addressBuildingInitialValue = member?.[
		`memberAttributeId${addressBuilding?.memberAttributeId}`
	] as string

	return (
		<motion.div className='mb-6' variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}>
			<p className='px-6'>
				<span className='font-bold'>{`${memberAttributePostalCode?.label}`}</span>
			</p>
			<MemberAttributeAddressPostalInput
				item={memberAttributePostalCode}
				initialValue={addressPostalInitialValue}
				memberAttributes={memberAttributes}
			/>
			{/* Prefecture */}
			<MemberAttributePrefectureSelectInput
				item={addressPrefecture}
				initialValue={addressPrefectureInitialValue}
			/>
			{/* City */}
			<MemberAttributeTextInput
				item={addressCity}
				initialValue={addressCityInitialValue}
				hideInputLabel={true}
				placeholderText='市区町村（例：名古屋市中区）'
			/>
			{/* Address */}
			<MemberAttributeTextInput
				item={addressAddress}
				initialValue={addressAddressInitialValue}
				hideInputLabel={true}
				placeholderText='町名番地（例：錦 1-1)'
			/>
			{/* Building */}
			<MemberAttributeTextInput
				item={addressBuilding}
				initialValue={addressBuildingInitialValue}
				hideInputLabel={true}
				placeholderText='建物名、部屋番号など'
			/>
		</motion.div>
	)
}

// Note initialValues are delegated to individual rendering, but may be worth investigating setting form initialValues to prevent passing down initial values
export const handleMemberAttributeInput = ({
	member,
	memberAttribute,
	memberAttributes,
}: {
	member: Record<string, unknown>
	memberAttribute: MemberAttribute
	memberAttributes: MemberAttribute[]
}) => {
	if (!memberAttribute || !memberAttribute?.type) return null
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const initialValue: any = member?.[`memberAttributeId${memberAttribute?.memberAttributeId}`]

	switch (memberAttribute?.type) {
		case 'text':
			return <MemberAttributeTextInput item={memberAttribute} initialValue={initialValue} />
		case 'textarea':
			return (
				<MemberAttributeTextareaInput item={memberAttribute} initialValue={initialValue} />
			)
		// case 'color':
		// 	return <MemberAttributeColorInput item={memberAttribute} initialValue={initialValue} />
		case 'url':
			return <MemberAttributeUrlInput item={memberAttribute} initialValue={initialValue} />
		case 'number_integer':
			return (
				<MemberAttributeNumberIntegerInput
					item={memberAttribute}
					initialValue={initialValue}
				/>
			)
		case 'number_float':
			return (
				<MemberAttributeNumberFloatInput
					item={memberAttribute}
					initialValue={initialValue}
				/>
			)
		// case 'boolean':
		// 	return <MemberAttributeBooleanInput item={memberAttribute} initialValue={initialValue} />
		case 'select':
			return <MemberAttributeSelectInput item={memberAttribute} initialValue={initialValue} />
		case 'radio':
			return <MemberAttributeRadioInput item={memberAttribute} initialValue={initialValue} />
		case 'checkbox':
			return (
				<MemberAttributeCheckboxInput item={memberAttribute} initialValue={initialValue} />
			)
		case 'date':
			return (
				<MemberAttributeDatePickerInput
					item={memberAttribute}
					initialValue={initialValue}
				/>
			)
		case 'time':
			return <MemberAttributeTimeInput item={memberAttribute} initialValue={initialValue} />
		case 'datetime':
			return (
				<MemberAttributeDateTimeInput item={memberAttribute} initialValue={initialValue} />
			)
		case 'file':
			return <MemberAttributeFileInput item={memberAttribute} initialValue={initialValue} />
		case 'image':
			return <MemberAttributeImageInput item={memberAttribute} initialValue={initialValue} />
		case 'video':
			return <MemberAttributeVideoInput item={memberAttribute} initialValue={initialValue} />
		case 'audio':
			return <MemberAttributeAudioInput item={memberAttribute} initialValue={initialValue} />
		case 'email':
			return <MemberAttributeEmailInput item={memberAttribute} initialValue={initialValue} />
		case 'telephone':
			return (
				<MemberAttributeTelephoneInput item={memberAttribute} initialValue={initialValue} />
			)
		case 'firstName':
			return (
				<MemberAttributeFirstNameInput item={memberAttribute} initialValue={initialValue} />
			)
		case 'lastName':
			return (
				<MemberAttributeLastNameInput item={memberAttribute} initialValue={initialValue} />
			)
		case 'fullName':
			return (
				<MemberAttributeLastNameInput item={memberAttribute} initialValue={initialValue} />
			)
		case 'firstNameKana':
			return (
				<MemberAttributeFirstNameKanaInput
					item={memberAttribute}
					initialValue={initialValue}
				/>
			)
		case 'lastNameKana':
			return (
				<MemberAttributeLastNameKanaInput
					item={memberAttribute}
					initialValue={initialValue}
				/>
			)
		case 'fullNameKana':
			return (
				<MemberAttributeLastNameKanaInput
					item={memberAttribute}
					initialValue={initialValue}
				/>
			)
		case 'address_postal':
			return (
				<MemberAttributeAddressInputGroup
					member={member}
					memberAttributes={memberAttributes}
					memberAttributePostalCode={memberAttribute}
				/>
			)
		default:
			return <></>
	}
}
export const processMemberAttributeFormData = (
	data: { [key: string]: unknown },
	memberAttributes: MemberAttribute[],
) => {
	const formData = new FormData()
	memberAttributes.forEach((item) => {
		const fieldKey = `memberAttributeId${item?.memberAttributeId}`
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fieldVal: any = data[fieldKey]
		console.log(fieldKey, fieldVal)
		if (item.type === 'image') {
			if (fieldVal) {
				formData.append(fieldKey, fieldVal?.name)
				formData.append(`photos`, fieldVal)
			}
		} else if (item.type === 'time') {
			if (fieldVal) {
				const formattedTime = dayjs(fieldVal).format('HH:mm')
				formData.append(fieldKey, formattedTime)
			}
		} else {
			if (fieldVal !== undefined && fieldVal !== null) {
				formData.append(fieldKey, fieldVal)
			}
		}
	})
	return formData
}
