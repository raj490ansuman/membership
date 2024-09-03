import { Image } from 'antd'
import { COMMONS } from '@/utils'
import { motion } from 'framer-motion'
import { SET_DATA_DEFAULT_USER, SET_DATA_MEMBER_USER } from './SelectLayout.action'

const IMG_LAYOUT_TEMPLATE = {
	compact: [
		'richmenu-template-guidem-01.png',
		'richmenu-template-guidem-02.png',
		'richmenu-template-guidem-03.png',
		'richmenu-template-guidem-04.png',
		'richmenu-template-guidem-05.png'
	],
	large: [
		'richmenu-template-guidem-01.png',
		'richmenu-template-guidem-02.png',
		'richmenu-template-guidem-03.png',
		'richmenu-template-guidem-04.png',
		'richmenu-template-guidem-05.png',
		'richmenu-template-guidem-06.png',
		'richmenu-template-guidem-07.png'
	]
}

const LINK_INPUT = {
	compact: {
		'richmenu-template-guidem-01.png': 3,
		'richmenu-template-guidem-02.png': 2,
		'richmenu-template-guidem-03.png': 2,
		'richmenu-template-guidem-04.png': 2,
		'richmenu-template-guidem-05.png': 1
	},
	large: {
		'richmenu-template-guidem-01.png': 6,
		'richmenu-template-guidem-02.png': 4,
		'richmenu-template-guidem-03.png': 4,
		'richmenu-template-guidem-04.png': 3,
		'richmenu-template-guidem-05.png': 2,
		'richmenu-template-guidem-06.png': 2,
		'richmenu-template-guidem-07.png': 1
	}
}

const LAYOUT_TEMPLATE_TYPE = {
	compact: 'compact',
	large: 'large'
}

export const ImageTemplateContainer = ({ type, setIsOpenImageTemplate, selected, dispatcher, state }) => {
	const selectImageTemplate = (item) => {
		selected === 'default'
			? dispatcher({
					type: SET_DATA_DEFAULT_USER,
					payload: {
						...state.default,
						inputNumber: LINK_INPUT[state.default.imgType][item],
						imgSelect: `/assets/${state.default.imgType}/${item}`
					}
			  })
			: dispatcher({
					type: SET_DATA_MEMBER_USER,
					payload: {
						...state.member,
						inputNumber: LINK_INPUT[state.member.imgType][item],
						imgSelect: `/assets/${state.member.imgType}/${item}`
					}
			  })
		setIsOpenImageTemplate(false)
	}
	return (
		<motion.div>
			<h4 className="capitalize">{LAYOUT_TEMPLATE_TYPE[type]}</h4>
			<div className="flex flex-wrap justify-around">
				{IMG_LAYOUT_TEMPLATE[selected === 'default' ? state.default.imgType : state.member.imgType].map(
					(item) => {
						return (
							<figure key={item} className="cursor-pointer inline-block mx-2 my-2 customImage ">
								<Image
									src={`/assets/${
										selected === 'default' ? state.default.imgType : state.member.imgType
									}/${item}`}
									className="w-full rounded object-contain aspect-square"
									preview={false}
									alt="テンプレート"
									width={220}
									onClick={() => selectImageTemplate(item)}
								/>
							</figure>
						)
					}
				)}
			</div>
		</motion.div>
	)
}

export const SelectLayout = ({ handleSelectTemplate, imgSrc, imgDefault, children }) => {
	return (
		<>
			<motion.div
				className="flex flex-col justify-center bg-amber-50 p-4 rounded mb-4"
				variants={COMMONS.ANIMATION_VARIANT_STAGGER_ITEM}
			>
				<Image
					src={imgSrc || imgDefault}
					className="w-full rounded cursor-pointer object-contain"
					preview={false}
					alt="テンプレート"
					onClick={handleSelectTemplate}
				/>
				{children}
			</motion.div>
		</>
	)
}
