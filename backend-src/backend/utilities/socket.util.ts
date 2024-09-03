import socketio, { Server as SocketServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { systemConfig } from '../config'

const iooptions = {
	serveClient: systemConfig.ENV_TEST ? true : false,
	path: '/socket.io',
	cors: {
		origin: systemConfig.ENV_TEST
			? systemConfig.NGROK_URI
				? ['http://localhost:3000', systemConfig.NGROK_URI]
				: ['http://localhost:3000']
			: systemConfig.SITE_URI
	}
}

// let socketIO: any;
const socketIO: SocketServer = new socketio.Server(iooptions)
function attachSocketServer(httpServer: HttpServer) {
	socketIO.attach(httpServer)
}

const emitAnnouncement = ({ announcementId }: { announcementId: number | string }) =>
	socketIO.emit('announcement', { announcementId: announcementId })

const emitAttendance = ({ attendanceId }: { attendanceId: number }) =>
	socketIO.emit('attendance', { attendanceId: attendanceId })

const emitAudience = (audienceGroupId: { audienceGroupId: number | string }) =>
	socketIO.emit('audience', { audienceGroupId: audienceGroupId })

const emitCategory = ({ categoryId }: { categoryId?: number }) => socketIO.emit('category', { categoryId: categoryId })

const emitChat = ({ memberId }: { memberId: number }) => socketIO.emit('chat', { memberId: memberId })

const emitFavicon = ({ favicon }: { favicon: string }) => socketIO.emit('favicon', { favicon: favicon })

const emitLogo = ({ logo }: { logo: string }) => socketIO.emit('logo', { logo: logo })

const emitStorePic = ({ storePic }: { storePic: string }) => socketIO.emit('storePic', { logo: storePic })

const emitMember = ({ memberId }: { memberId: number | string | null }) =>
	socketIO.emit('member', { memberId: memberId })

const emitSystemSetting = ({ keys }: { keys: string[] }) => socketIO.emit('systemSetting', { keys: keys })

const emitTemplate = ({ name }: { name: string }) => socketIO.emit('template', { name: name })

const emitTimeline = ({ timelineId }: { timelineId: number }) =>
	socketIO.emit('announcement', { announcementId: timelineId })

export default {
	socketIO,
	attachSocketServer,
	emitAnnouncement,
	emitAttendance,
	emitAudience,
	emitCategory,
	emitChat,
	emitFavicon,
	emitLogo,
	emitStorePic,
	emitMember,
	emitSystemSetting,
	emitTemplate,
	emitTimeline
}
