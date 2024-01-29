import { defineQuery, defineSystem, SimulationSystemGroup, getComponent } from "@etherealengine/ecs"
import { Vector3 } from "three"
import { BubbleEmitterComponent } from "../components/BubbleEmitterComponent"
import { TransformComponent } from "@etherealengine/engine/src/transform/components/TransformComponent"

const bubbleEmitterQuery = defineQuery([BubbleEmitterComponent])
const velocity = new Vector3(0,0,0)

export const BubbleSystem = defineSystem({
  uuid: "BubbleSystem",
  insert: { after: SimulationSystemGroup },
  execute: () => {
    for (const entity of bubbleEmitterQuery()) {
      // [Exercise 2]: Using the below basic setup. Move every bubble not just the first one
      const tempvector = new Vector3(0,0,0)
      const emitterComponent = getComponent(entity, BubbleEmitterComponent)
      const localTransform = getComponent(emitterComponent.bubbleEntities![0], TransformComponent)
      if(!localTransform) continue;
      velocity.copy(emitterComponent.direction).multiplyScalar(emitterComponent.speed)
      tempvector.addVectors(localTransform.position, velocity)
      localTransform.position.copy(tempvector)

      // [Exercise 4]: Utilizing an AvatarComponent Query, TransformComponent positions of bubble entities, and Vector3.distanceTo
      // Detect if the player is near a bubble and remove it
    }
  }
})