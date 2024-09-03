import { Breadcrumb, Divider, theme } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'

const { useToken } = theme

const PageHeader = (props) => {
	const { publicSettings, routes, title, previous, actions } = props

	const { token } = useToken()
	const navigate = useNavigate()

	return (
		<>
			<div className="flex flex-col mx-6 my-4">
				{routes && (
					<div className="flex justify-start mb-2">
						<Breadcrumb
							items={routes}
							itemRender={(route, params, routes, paths) => {
								const last = routes.indexOf(route) === routes.length - 1

								return last ? (
									<span>{route.breadcrumbName}</span>
								) : (
									<Link to={route.path}>{route.breadcrumbName}</Link>
								)
							}}
						/>
					</div>
				)}
				<div className="flex flex-wrap gap-y-4 justify-between items-center">
					<div className="flex flex-wrap items-center">
						{previous && (
							<ArrowLeftOutlined
								onClick={() => {
									navigate(previous)
								}}
								style={{ color: publicSettings?.PRIMARY_COLOR?.valueString }}
								className="text-lg mr-4"
							/>
						)}
						<p className="text-lg font-bold" style={{ color: token.colorText }}>
							{title}
						</p>
					</div>
					<div className="flex flex-wrap items-center">{actions}</div>
				</div>
			</div>
			<Divider className="my-0" />
		</>
	)
}

export default PageHeader
