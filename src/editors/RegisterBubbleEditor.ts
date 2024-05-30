import { ComponentEditorsState } from '@etherealengine/editor/src/services/ComponentEditors'
import { ComponentShelfCategoriesState } from '@etherealengine/editor/src/services/ComponentShelfCategoriesState'
import { getMutableState } from '@etherealengine/hyperflux'
import { BubbleEmitterComponent } from '../components/BubbleEmitterComponent'
import { BubbleNodeEditor } from './BubbleComponentNodeEditor'

getMutableState(ComponentEditorsState).merge({ [BubbleEmitterComponent.name]: BubbleNodeEditor })
getMutableState(ComponentShelfCategoriesState).Misc.merge([BubbleEmitterComponent])
