import { Image, Upload } from 'antd'
import { CameraOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import React from 'react'
import styled from 'styled-components'
import { COMMONS } from '@/utils'
import { TapAnimationComponent } from '@/components'

const CustomUpload = styled(Upload)`
	.ant-upload {
		width: 100%;
	}
`

const CropUpload = (props) => {
	const { id, onChange, aspect, modalTitle, uploadFile, setUploadFile, height } = props

	return (
		<span id={id}>
			<ImgCrop
				grid
				zoom={false}
				rotate={false}
				aspect={aspect}
				quality={0.8}
				minZoom={1}
				maxZoom={1}
				modalTitle={modalTitle}
				modalOk="確定"
				modalCancel="キャンセル"
			>
				<CustomUpload
					accept=".jpg, .jpeg, .png"
					maxCount={1}
					showUploadList={false}
					beforeUpload={async (file) => {
						const _file = await COMMONS.RESIZE_FILE(file, 'file')
						const _preview = await COMMONS.RESIZE_FILE(file, 'base64')

						setUploadFile({
							file: _file,
							preview: _preview
						})

						return false
					}}
					onChange={(param) => {
						onChange(param?.file)
					}}
				>
					<TapAnimationComponent>
						{uploadFile?.file || uploadFile?.preview ? (
							<div className="flex justify-center">
								<Image
									preview={false}
									src={uploadFile?.preview}
									alt={modalTitle}
									fallback="/no-image.png"
									style={{ maxHeight: height }}
									className="max-w-full cursor-pointer object-contain"
								/>
							</div>
						) : (
							<div
								className="flex justify-center items-center bg-white border border-gray-300 rounded w-full cursor-pointer"
								style={{
									height: height,
									maxHeight: height
								}}
							>
								<p className="text-center text-2xl font-bold">
									<CameraOutlined className="mr-2" />
								</p>
							</div>
						)}
					</TapAnimationComponent>
				</CustomUpload>
			</ImgCrop>
		</span>
	)
}

export default CropUpload
