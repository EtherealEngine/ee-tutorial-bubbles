import { isClient } from "@etherealengine/engine/src/common/functions/getEnvironment";
import { ComponentShelfCategories } from '@etherealengine/editor/src/components/element/ElementList'
import { EntityNodeEditor } from '@etherealengine/editor/src/functions/ComponentEditors'
import { getState } from "@etherealengine/hyperflux";
import { EngineState } from "@etherealengine/engine/src/ecs/classes/EngineState";
import { BubbleEmitterComponent } from "./components/BubbleEmitterComponent";
import { BubbleNodeEditor } from "./editors/BubbleComponentNodeEditor";
import { startSystem } from "@etherealengine/engine/src/ecs/functions/SystemFunctions";
import { BubbleSystem } from "./systems/BubbleSystem";
import { SimulationSystemGroup } from "@etherealengine/engine/src/ecs/functions/EngineFunctions";

export default async function worldInjection() {
  if (isClient) {
    if (getState(EngineState).isEditing)
    {
      EntityNodeEditor.set(BubbleEmitterComponent, BubbleNodeEditor)
      ComponentShelfCategories.Misc.push(BubbleEmitterComponent)
    }
    startSystem(BubbleSystem, { after: SimulationSystemGroup })
  }
}