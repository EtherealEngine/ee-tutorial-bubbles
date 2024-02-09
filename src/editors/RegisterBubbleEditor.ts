import { ComponentShelfCategories } from '@etherealengine/editor/src/components/element/ElementList'
import { EntityNodeEditor } from '@etherealengine/editor/src/functions/ComponentEditors'
import { BubbleEmitterComponent } from '../components/BubbleEmitterComponent'
import { BubbleNodeEditor } from './BubbleComponentNodeEditor'

EntityNodeEditor.set(BubbleEmitterComponent, BubbleNodeEditor)
ComponentShelfCategories.Misc.push(BubbleEmitterComponent)
