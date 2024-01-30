import { ComponentShelfCategories } from '@etherealengine/editor/src/components/element/ElementList'
import { EntityNodeEditor } from '@etherealengine/editor/src/functions/ComponentEditors'
import { getState } from "@etherealengine/hyperflux";
import { BubbleEmitterComponent } from "./components/BubbleEmitterComponent";
import { BubbleNodeEditor } from "./editors/BubbleComponentNodeEditor";
import { BubbleSystem } from "./systems/BubbleSystem";
import { isClient } from '@etherealengine/common/src/utils/getEnvironment';
import { EngineState } from '@etherealengine/spatial/src/EngineState';

export default async function worldInjection() {
  if (isClient) {
    if (getState(EngineState).isEditing)
    {
      EntityNodeEditor.set(BubbleEmitterComponent, BubbleNodeEditor)
      ComponentShelfCategories.Misc.push(BubbleEmitterComponent)
    }
  }
}

export { BubbleSystem }