import { Area, MessageAction } from '@line/bot-sdk'
import { type RichMenuTemplate } from '../../schemas'

export const RICHMENU_HEIGHT = 810
export const RICHMENU_WIDTH = 1200
export const RICHMENU_AREA_BIG_HEIGHT = 810
export const RICHMENU_AREA_BIG_WIDTH = 800
export const RICHMENU_AREA_SMALL_HEIGHT = 405
export const RICHMENU_AREA_SMALL_WIDTH = 400

export const RICHMENU_TAB_HEIGHT_COMPACT = 100
export const RICHMENU_TAB_WIDTH_COMPACT = RICHMENU_WIDTH

export const RICHMENU_TAB_HEIGHT_LARGE = 100
export const RICHMENU_TAB_WIDTH_LARGE = RICHMENU_WIDTH

export enum RICHMENU_SIZE_TYPE {
	COMPACT = 'compact',
	LARGE = 'large'
}
const sampleMessageAction: MessageAction = {
	type: 'message',
	text: 'メッセージ'
}

export const RICHMENU_GROUP_STATUS = ['DRAFT', 'PUBLISHED']
/**
 * RICH MENU AREAS
 */
export const RICHMENU_TEMPLATE_AREAS_COMPACT = {
	RICH_MENU_TEMPLATE_101: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 3,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH / 3) * 2,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_102: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 2,
					y: 0,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_103: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: (RICHMENU_WIDTH * 2) / 3,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH * 2) / 3,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_104: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 3,
					y: 0,
					width: (RICHMENU_WIDTH * 2) / 3,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_105: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH,
					height: RICHMENU_AREA_SMALL_HEIGHT
				} as Area,
				action: sampleMessageAction
			}
		]
	}
}

export const RICHMENU_TEMPLATE_AREAS_LARGE = {
	RICH_MENU_CUSTOM_TEMPLATE_201: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 200,
					width: RICHMENU_WIDTH / 3,
					height: (RICHMENU_AREA_BIG_HEIGHT - 200) / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 3,
					y: 200,
					width: RICHMENU_WIDTH / 3,
					height: (RICHMENU_AREA_BIG_HEIGHT - 200) / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH / 3) * 2,
					y: 200,
					width: RICHMENU_WIDTH / 3,
					height: (RICHMENU_AREA_BIG_HEIGHT - 200) / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: 0,
					y: 200 + (RICHMENU_AREA_BIG_HEIGHT - 200) / 2,
					width: RICHMENU_WIDTH / 3,
					height: (RICHMENU_AREA_BIG_HEIGHT - 200) / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 3,
					y: 200 + (RICHMENU_AREA_BIG_HEIGHT - 200) / 2,
					width: RICHMENU_WIDTH / 3,
					height: (RICHMENU_AREA_BIG_HEIGHT - 200) / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH / 3) * 2,
					y: 200 + (RICHMENU_AREA_BIG_HEIGHT - 200) / 2,
					width: RICHMENU_WIDTH / 3,
					height: (RICHMENU_AREA_BIG_HEIGHT - 200) / 2
				} as Area,
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_CUSTOM_TEMPLATE_202: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 110,
					width: RICHMENU_WIDTH / 2,
					height: (RICHMENU_AREA_BIG_HEIGHT - 110) / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 2,
					y: 110,
					width: RICHMENU_WIDTH / 2,
					height: (RICHMENU_AREA_BIG_HEIGHT - 110) / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: 0,
					y: 110 + (RICHMENU_AREA_BIG_HEIGHT - 110) / 2,
					width: RICHMENU_WIDTH / 2,
					height: (RICHMENU_AREA_BIG_HEIGHT - 110) / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 2,
					y: 110 + (RICHMENU_AREA_BIG_HEIGHT - 110) / 2,
					width: RICHMENU_WIDTH / 2,
					height: (RICHMENU_AREA_BIG_HEIGHT - 110) / 2
				} as Area,
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_201: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 3,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH / 3) * 2,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: 0,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 3,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH / 3) * 2,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_202: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 2,
					y: 0,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: 0,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 2,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_203: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: 0,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 3,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH / 3) * 2,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				},
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_204: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: (RICHMENU_WIDTH / 3) * 2,
					height: RICHMENU_HEIGHT
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH / 3) * 2,
					y: 0,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: (RICHMENU_WIDTH / 3) * 2,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH / 3,
					height: RICHMENU_HEIGHT / 2
				},
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_205: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH,
					height: RICHMENU_HEIGHT / 2
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: 0,
					y: RICHMENU_HEIGHT / 2,
					width: RICHMENU_WIDTH,
					height: RICHMENU_HEIGHT / 2
				},
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_206: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT
				} as Area,
				action: sampleMessageAction
			},
			{
				bounds: {
					x: RICHMENU_WIDTH / 2,
					y: 0,
					width: RICHMENU_WIDTH / 2,
					height: RICHMENU_HEIGHT
				},
				action: sampleMessageAction
			}
		]
	},
	RICH_MENU_TEMPLATE_207: {
		areas: [
			{
				bounds: {
					x: 0,
					y: 0,
					width: RICHMENU_WIDTH,
					height: RICHMENU_HEIGHT
				},
				action: sampleMessageAction
			}
		]
	}
}

/**
 * RICH MENU SIZE DIMENSIONS
 */
export const RICHMENU_DIMENSIONS_COMPACT = {
	width: RICHMENU_WIDTH,
	height: RICHMENU_AREA_SMALL_HEIGHT
}
export const RICHMENU_DIMENSIONS_LARGE = {
	width: RICHMENU_WIDTH,
	height: RICHMENU_HEIGHT
}

/**
 * RICH MENU TEMPLATES
 * TODO: DYNAMIC CREATION
 */
export const RICHMENU_TEMPLATES_COMPACT: { [name: string]: RichMenuTemplate } = {
	// COMPACT: 3 X 1
	RICH_MENU_TEMPLATE_101: {
		name: 'RICH_MENU_TEMPLATE_101',
		size: RICHMENU_DIMENSIONS_COMPACT,
		areas: RICHMENU_TEMPLATE_AREAS_COMPACT['RICH_MENU_TEMPLATE_101'].areas
	},
	// COMPACT: 1 X (2 / 3)
	RICH_MENU_TEMPLATE_102: {
		name: 'RICH_MENU_TEMPLATE_102',
		size: RICHMENU_DIMENSIONS_COMPACT,
		areas: RICHMENU_TEMPLATE_AREAS_COMPACT['RICH_MENU_TEMPLATE_102'].areas
	},
	// COMPACT: (2 / 3) X 1
	RICH_MENU_TEMPLATE_103: {
		name: 'RICH_MENU_TEMPLATE_103',
		size: RICHMENU_DIMENSIONS_COMPACT,
		areas: RICHMENU_TEMPLATE_AREAS_COMPACT['RICH_MENU_TEMPLATE_103'].areas
	},
	// COMPACT: 1 / 2
	RICH_MENU_TEMPLATE_104: {
		name: 'RICH_MENU_TEMPLATE_104',
		size: RICHMENU_DIMENSIONS_COMPACT,
		areas: RICHMENU_TEMPLATE_AREAS_COMPACT['RICH_MENU_TEMPLATE_104'].areas
	},
	// COMPACT: 1
	RICH_MENU_TEMPLATE_105: {
		name: 'RICH_MENU_TEMPLATE_105',
		size: RICHMENU_DIMENSIONS_COMPACT,
		areas: RICHMENU_TEMPLATE_AREAS_COMPACT['RICH_MENU_TEMPLATE_105'].areas
	}
}

export const RICHMENU_TEMPLATES_LARGE: { [name: string]: RichMenuTemplate } = {
	// // LARGE: 3-TAB, 3 X 2
	// RICH_MENU_CUSTOM_TEMPLATE_201: {
	// 	name: 'RICH_MENU_CUSTOM_TEMPLATE_201',
	// 	size: RICHMENU_DIMENSIONS_LARGE,
	// 	areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_CUSTOM_TEMPLATE_201'].areas
	// },
	// // LARGE: 3-TAB, 2 X 2
	// RICH_MENU_CUSTOM_TEMPLATE_202: {
	// 	name: 'RICH_MENU_CUSTOM_TEMPLATE_202',
	// 	size: RICHMENU_DIMENSIONS_LARGE,
	// 	areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_CUSTOM_TEMPLATE_202'].areas
	// },
	// LARGE: 3 X 3
	RICH_MENU_TEMPLATE_201: {
		name: 'RICH_MENU_TEMPLATE_201',
		size: RICHMENU_DIMENSIONS_LARGE,
		areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_TEMPLATE_201'].areas
	},
	// LARGE: 2 X 2
	RICH_MENU_TEMPLATE_202: {
		name: 'RICH_MENU_TEMPLATE_202',
		size: RICHMENU_DIMENSIONS_LARGE,
		areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_TEMPLATE_202'].areas
	},
	// LARGE: 1 / 3
	RICH_MENU_TEMPLATE_203: {
		name: 'RICH_MENU_TEMPLATE_203',
		size: RICHMENU_DIMENSIONS_LARGE,
		areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_TEMPLATE_203'].areas
	},
	// LARGE: 1 X (1 / 2)
	RICH_MENU_TEMPLATE_204: {
		name: 'RICH_MENU_TEMPLATE_204',
		size: RICHMENU_DIMENSIONS_LARGE,
		areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_TEMPLATE_204'].areas
	},
	// LARGE: HORIZONTAL 1 / 2
	RICH_MENU_TEMPLATE_205: {
		name: 'RICH_MENU_TEMPLATE_205',
		size: RICHMENU_DIMENSIONS_LARGE,
		areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_TEMPLATE_205'].areas
	},
	// LARGE: VERTICAL 1 / 2
	RICH_MENU_TEMPLATE_206: {
		name: 'RICH_MENU_TEMPLATE_206',
		size: RICHMENU_DIMENSIONS_LARGE,
		areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_TEMPLATE_206'].areas
	},
	// LARGE: 1
	RICH_MENU_TEMPLATE_207: {
		name: 'RICH_MENU_TEMPLATE_207',
		size: RICHMENU_DIMENSIONS_LARGE,
		areas: RICHMENU_TEMPLATE_AREAS_LARGE['RICH_MENU_TEMPLATE_207'].areas
	}
}
