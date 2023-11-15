import { defineQuery, getComponent, getMutableComponent } from "@etherealengine/engine/src/ecs/functions/ComponentFunctions";
import { defineSystem } from "@etherealengine/engine/src/ecs/functions/SystemFunctions";
import { BubbleComponent } from "../components/BubbleComponent";
import { LocalTransformComponent } from "@etherealengine/engine/src/transform/components/TransformComponent";
import { NO_PROXY, getState } from "@etherealengine/hyperflux";
import { EngineState } from "@etherealengine/engine/src/ecs/classes/EngineState";
import { Vector3 } from "three";

const bubbleQuery = defineQuery([BubbleComponent])

let collectedtime = 0 //Assign out of system so scope persists


export const BubbleSystem = defineSystem({
  uuid: "BubbleSystem",
  execute: () => {
    const { elapsedSeconds, deltaSeconds } = getState(EngineState)
    for (const entity of bubbleQuery()) {
      const tempvector = new Vector3(0,0,0)
      const bubbleComponent = getComponent(entity, BubbleComponent)
      const localTransform = getMutableComponent(bubbleComponent.bubbleEntity!, LocalTransformComponent)
      tempvector.addVectors(localTransform.position.value, bubbleComponent.direction.clone().multiplyScalar(bubbleComponent.speed))
      localTransform.position.get(NO_PROXY).copy(tempvector)

      if(collectedtime >= 5) { //Reset Position and collectedTime
        tempvector.set(0,0,0)
        localTransform.position.get(NO_PROXY).copy(tempvector)
        collectedtime = 0
      } else {
        collectedtime += deltaSeconds //CollectElapsed seconds since System has been ran
      }
    }
  }
})