import { API } from '@/utils'

const TopBarComponent = (props) => {
	const { logo } = props

	return (
		<>
			<div className="flex flex-col px-4">
				<div className="flex justify-center">
					{logo ? (
						<img
							style={{
								maxHeight: '150px'
							}}
							alt="ロゴ"
							src={`${API.SETTINGS_UPLOADS_URL}${logo}`}
							className="rounded max-w-full object-contain"
						/>
					) : (
						<img
							style={{
								maxHeight: '150px'
							}}
							alt="ロゴ"
							src="/logo.svg"
							className="rounded max-w-full object-contain"
						/>
					)}
				</div>
			</div>
		</>
	)
}

export default TopBarComponent
