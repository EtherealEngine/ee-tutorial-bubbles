import { defineComponent, getComponent, getMutableComponent, setComponent, useComponent } from "@etherealengine/engine/src/ecs/functions/ComponentFunctions"
import { createEntity, removeEntity, useEntityContext } from "@etherealengine/engine/src/ecs/functions/EntityFunctions"
import { BufferGeometry, Color, MathUtils, Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from "three"
import { useEffect } from "react"
import { GroupComponent, addObjectToGroup } from "@etherealengine/engine/src/scene/components/GroupComponent"
import { Entity } from "@etherealengine/engine/src/ecs/classes/Entity"
import { NameComponent } from "@etherealengine/engine/src/scene/components/NameComponent"
import { EntityUUID } from "@etherealengine/common/src/interfaces/EntityUUID"
import { EntityTreeComponent } from "@etherealengine/engine/src/ecs/functions/EntityTree"
import { VisibleComponent } from "@etherealengine/engine/src/scene/components/VisibleComponent"
import { BubbleComponent } from "./BubbleComponent"
import { NO_PROXY, getState } from "@etherealengine/hyperflux"
import { useExecute } from "@etherealengine/engine/src/ecs/functions/SystemFunctions"
import { SimulationSystemGroup } from "@etherealengine/engine/src/ecs/functions/EngineFunctions"
import { EngineState } from "@etherealengine/engine/src/ecs/classes/EngineState"

export const BubbleEmitterComponent = defineComponent({
  //name: The human-readable label for the component. This will be displayed in the editor and debugging tools.
  name: "Bubble Emitter Component",
  //jsonID: The serialized name of the component. This is used to identify the component in the serialized scene data
  jsonID: "bubbleEmitter",
  //onInit: Initializer function that is called when the component is added to an entity. The return type of this function defines the 
  //        schema of the component's runtime data.
  onInit: (entity) => {
    return {
      color: new Color(0xFFFFFF),
      direction: new Vector3(0, 1, 0),
      speed: .1,
      bubbleEntities: [] as Entity[] | null
    }
  },
  //onSet: Set function that is called whenever the component's data is updated via the setComponent function. This is where deserialize logic should
  //       be applied.
  onSet: (entity, component, json) => {
    if (!json) return
    if (json.color?.isColor) {
      component.color.set(json.color)
    }
  },
  //toJSON: Serializer function that is called when the component is being saved to a scene file or snapshot. This is where serialize logic should
  //       be applied to convert the component's runtime data into a JSON object.
  toJSON: (entity, component) => {
    return {
      color: component.color.value,
      direction: component.direction.value,
      speed: component.speed.value
    }
  },

  //reactor: The reactor function is where async reactive logic is defined. Any side-effects that depend upon component data should be defined here.
  //reactive: 
  reactor: () => {
    // get the entity using useEntityContext
    const entity = useEntityContext()

    // get a reactive component state with useComponent
    const emitterComponent = useComponent(entity, BubbleEmitterComponent)

    // a useEffect with no dependencies will only run once, when the component is first initialized
    // it's return statement will run when the component is unmounted
    useEffect(() => {
      return () => {
        for(let ent of emitterComponent.bubbleEntities.value!) {
          removeEntity(ent)
        }
      }
    }, [])

    // a useEffect with dependencies will run whenever the dependencies change
    // Whenever the color is changed this will rerun and update all child bubble materials
    useEffect(() => {
      for(let ent of emitterComponent.bubbleEntities.value!) {
        const groupComponent = getComponent(ent, GroupComponent)
        const obj = groupComponent[0]
        obj.traverse((obj: Mesh<BufferGeometry, MeshStandardMaterial>) => {
          if(obj.isMesh) {
            const material = obj.material as MeshStandardMaterial
            material.color.copy(emitterComponent.color.value)
          }
        })
      }
    }, [emitterComponent.color])

    // useExecute is a way we can define a System within a reactive context
    // Systems will run once per frame
    // You must explicitly say where you want your system to run(i.e. after SimulationSystemGroup)
    useExecute(() => {
      const { elapsedSeconds, deltaSeconds } = getState(EngineState)
      ageEmitterBubbles(entity, deltaSeconds) // This function is accumulating the age of every bubble with the time from deltaSeconds.
      // deltaSeconds is the time since the last system execute occured

      // Spawning a single bubble as an example
      // [Exercise 1]: Using this system. Spawn multiple bubbles with varying x,z Localtransform positons
      // [Exercise 3]: Remove them if they are too old(bubble.age > N seconds)[This can be done in a couple ways(reactively and within this sytem synchronosly)]
      if(emitterComponent.bubbleEntities.value!.length < 1) { //For example ensuring there is only one bubble being added
        const bubbleEntity = createEntity()
        setComponent(bubbleEntity, BubbleComponent)
        setComponent(bubbleEntity, EntityTreeComponent, {
          parentEntity: entity,
          uuid: MathUtils.generateUUID() as EntityUUID
        })
        const currEntities = emitterComponent.bubbleEntities.get(NO_PROXY)
        emitterComponent.bubbleEntities.set([...currEntities!,bubbleEntity])
      }

      const bubble = getComponent(emitterComponent.bubbleEntities.value![0], BubbleComponent)

      if(bubble.age >= 5) { // Delete one bubble after its age is greater than 5 seconds
        removeBubble(entity,emitterComponent.bubbleEntities.value![0])
      }
    }, { after: SimulationSystemGroup })

    return null
  },
})

// These functions are not to be changed (unless there's a bug in them and I messed up.)

/**
 * Remove bubble entity from emitter
 */
export function removeBubble(emitterEntity: Entity, bubbleEntity: Entity): void {
  const emitter = getMutableComponent(emitterEntity, BubbleEmitterComponent)
  const currEntities = emitter.bubbleEntities.get(NO_PROXY)!
  const index = currEntities.indexOf(bubbleEntity);
  if (index > -1) { // only splice array when item is found
    currEntities.splice(index, 1) // deletes one entiry from array in place. 2nd Parameter means remove only one
    emitter.bubbleEntities.set(currEntities)
    removeEntity(bubbleEntity) // removes the given entity from the ECS
  }
}

/**
 * increment age of bubbles in an emitter
 */
export function ageEmitterBubbles(emitterEntity: Entity, deltaSeconds: number): void {
  const emitter = getComponent(emitterEntity, BubbleEmitterComponent)
  for(const bubbleEntity of emitter.bubbleEntities!) {
    const bubble = getMutableComponent(bubbleEntity, BubbleComponent) // getMutable gets the reactified version of the component that will respond to effects
    const currAge = bubble.age.get(NO_PROXY)
    bubble.age.set(currAge+deltaSeconds) // increment individual bubble age.
  }
}