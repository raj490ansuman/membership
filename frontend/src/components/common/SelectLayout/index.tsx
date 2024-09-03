import * as SelectLayout from './SelectLayout'
import * as SelectLayoutAction from './SelectLayout.action'
import * as SelectLayoutProvider from './SelectLayout.provider'
import * as SelectLayoutReducer from './SelectLayout.reducer'

const selectLayout = { ...SelectLayout, ...SelectLayoutAction, ...SelectLayoutProvider, ...SelectLayoutReducer }
export default selectLayout
