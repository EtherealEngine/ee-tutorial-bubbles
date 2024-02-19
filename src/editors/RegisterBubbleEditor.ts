import { ComponentShelfCategoriesState } from '@etherealengine/editor/src/components/element/ElementList'
import { ComponentEditorsState } from '@etherealengine/editor/src/functions/ComponentEditors'
import { BubbleEmitterComponent } from '../components/BubbleEmitterComponent'
import { BubbleNodeEditor } from './BubbleComponentNodeEditor'
import { getMutableState } from '@etherealengine/hyperflux'

getMutableState(ComponentEditorsState).merge({ [BubbleEmitterComponent.name]: BubbleNodeEditor })
getMutableState(ComponentShelfCategoriesState).Misc.merge([BubbleEmitterComponent])
