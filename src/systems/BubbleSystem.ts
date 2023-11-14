import { defineQuery, getComponent } from "@etherealengine/engine/src/ecs/functions/ComponentFunctions";
import { defineSystem } from "@etherealengine/engine/src/ecs/functions/SystemFunctions";
import { BubbleComponent } from "../components/BubbleComponent";
import { LocalTransformComponent } from "@etherealengine/engine/src/transform/components/TransformComponent";

const bubbleQuery = defineQuery([BubbleComponent])

export const BubbleSystem = defineSystem({
  uuid: "BubbleSystem",
  execute: () => {
    for (const entity of bubbleQuery()) {
      const bubbleComponent = getComponent(entity, BubbleComponent)
      const localTransform = getComponent(entity, LocalTransformComponent)
      localTransform.position.add(bubbleComponent.direction.clone().multiplyScalar(bubbleComponent.speed))
    }
  }
})