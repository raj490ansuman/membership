import path from 'path'

export default {
	// print logs to console instead of file output
	CONSOLE_ONLY: process.env.CONSOLE_ONLY == 'true',
	// root app
	PATH_ROOT: path.join(process.cwd()),
	PATH_FILE_UPLOAD: path.join(process.cwd(), 'public', 'uploads'),
	PATH_FILE_UPLOAD_CATEGORY: path.join(process.cwd(), 'public', 'uploads', 'categories'),
	PATH_FILE_UPLOAD_OCCASION: path.join(process.cwd(), 'public', 'uploads', 'occasions'),
	PATH_FILE_UPLOAD_MEMBER: path.join(process.cwd(), 'public', 'uploads', 'members'),
	PATH_FILE_UPLOAD_MEMBER_ATTRIBUTE_ID: (memberAttributeId: string) =>
		path.join(process.cwd(), 'public', 'uploads', 'members', `memberAttribute${memberAttributeId}`),
	PATH_FILE_UPLOAD_RICHMENU: path.join(process.cwd(), 'public', 'uploads', 'richmenus'),
	PATH_FILE_UPLOAD_SETTING: path.join(process.cwd(), 'public', 'uploads', 'settings'),
	PATH_FILE_QRCODE: path.join(process.cwd(), 'public', 'qrcode'),
	PATH_LINE_UPLOAD: path.join(process.cwd(), 'storage', 'line'),
	PATH_LOG: path.join(process.cwd(), 'logs'),
	// PORT
	PORT: parseInt(process.env.PORT as string, 10),

	// Set the NODE_ENV to 'development' by default
	NODE_ENV: process.env.NODE_ENV || 'development',
	isDevelopment: process.env.NODE_ENV == 'development',
	ENV_TEST: process.env.ENV_TEST == 'true',

	SITE_URI: process.env.SITE_URI as string,
	NGROK_URI: process.env.NGROK_URI,
	LINE_LIFF_ID: process.env.LINE_LIFF_ID,
	// session
	SALT_ROUND: 10,
	SESS_NAME: process.env.SESS_NAME || '',
	SESS_SEC: process.env.SESS_SEC || '',
	ENC_SEC: process.env.ENC_SEC || ''
}
