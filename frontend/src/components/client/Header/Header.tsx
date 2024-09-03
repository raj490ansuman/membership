const Header = (props) => {
	const { publicSettings, text, subText } = props

	return (
		<div
			className="w-full py-4"
			style={{
				backgroundColor: publicSettings?.PRIMARY_LIGHT_COLOR.valueString
			}}
		>
			<p
				className="text-center text-lg font-bold whitespace-pre-wrap"
				style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
			>
				{text}
			</p>
			{subText && (
				<p
					className="text-center text-xs whitespace-pre-wrap"
					style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
				>
					{subText}
				</p>
			)}
		</div>
	)
}

export default Header
