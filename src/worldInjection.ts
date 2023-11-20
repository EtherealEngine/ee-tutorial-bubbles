import { isClient } from "@etherealengine/engine/src/common/functions/getEnvironment";
import { ComponentShelfCategories } from '@etherealengine/editor/src/components/element/ElementList'
import { EntityNodeEditor } from '@etherealengine/editor/src/functions/ComponentEditors'
import { getState } from "@etherealengine/hyperflux";
import { EngineState } from "@etherealengine/engine/src/ecs/classes/EngineState";
import { BubbleEmitterComponent } from "./components/BubbleEmitterComponent";
import { BubbleNodeEditor } from "./editors/BubbleComponentNodeEditor";
import { BubbleSystem } from "./systems/BubbleSystem";

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