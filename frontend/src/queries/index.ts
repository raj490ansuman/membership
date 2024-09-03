import { mergeQueryKeys } from '@lukemorales/query-key-factory'
import { richmenus } from './richmenus.keys'
import { settings } from './settings.keys'
import { memberAttributes } from './memberAttributes.keys'

export * from './richmenus.queries'
export * from './settings.queries'
export * from './memberAttributes.queries'

export const queries = mergeQueryKeys(richmenus, settings, memberAttributes)
