import { defineQuery, getComponent, getMutableComponent } from "@etherealengine/engine/src/ecs/functions/ComponentFunctions";
import { defineSystem } from "@etherealengine/engine/src/ecs/functions/SystemFunctions";
import { BubbleEmitterComponent, removeBubble } from "../components/BubbleEmitterComponent";
import { BubbleComponent } from "../components/BubbleComponent";
import { LocalTransformComponent, TransformComponent } from "@etherealengine/engine/src/transform/components/TransformComponent";
import { NO_PROXY, getState } from "@etherealengine/hyperflux";
import { EngineState } from "@etherealengine/engine/src/ecs/classes/EngineState";
import { Vector3 } from "three";
import { SimulationSystemGroup } from "@etherealengine/engine/src/ecs/functions/EngineFunctions";
import { AvatarComponent } from "@etherealengine/engine/src/avatar/components/AvatarComponent";
import { EntityTreeComponent } from "@etherealengine/engine/src/ecs/functions/EntityTree";

const bubbleEmitterQuery = defineQuery([BubbleEmitterComponent])
const bubbleQuery = defineQuery([BubbleComponent])
const avatarQuery = defineQuery([AvatarComponent, TransformComponent])
const velocity = new Vector3(0,0,0)

export const BubbleSystem = defineSystem({
  uuid: "BubbleSystem",
  insert: { after: SimulationSystemGroup },
  execute: () => {
    for (const entity of bubbleEmitterQuery()) {
      // [Exercise 2]: Using the below basic setup. Move every bubble not just the first one
      const tempvector = new Vector3(0,0,0)
      const emitterComponent = getComponent(entity, BubbleEmitterComponent)
      for (const bubbleEntity of emitterComponent.bubbleEntities!) {
        const localTransform = getComponent(bubbleEntity, LocalTransformComponent)
        if(!localTransform) continue;
        velocity.copy(emitterComponent.direction).multiplyScalar(emitterComponent.speed)
        tempvector.addVectors(localTransform.position, velocity)
        localTransform.position.copy(tempvector)
      }
      // [Exercise 4]: Utilizing an AvatarComponent Query, TransformComponent positions of bubble entities, and Vector3.distanceTo
      // Detect if the player is near a bubble and remove it
    }

    for (const bubbleEntity of bubbleQuery()) {
      const bubbleWorldPosition = getComponent(bubbleEntity, TransformComponent).position
      for (const avatarEntity of avatarQuery()) {
        if (getComponent(avatarEntity, TransformComponent).position.distanceTo(bubbleWorldPosition) < 1) {
          const emitter = getComponent(bubbleEntity, EntityTreeComponent).parentEntity!
          removeBubble(emitter, bubbleEntity)
          break
        }
      }
    }
  }
})