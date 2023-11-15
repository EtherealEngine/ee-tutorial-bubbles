import { defineComponent, getComponent, setComponent, useComponent } from "@etherealengine/engine/src/ecs/functions/ComponentFunctions"
import { createEntity, useEntityContext } from "@etherealengine/engine/src/ecs/functions/EntityFunctions"
import { Color, MathUtils, Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from "three"
import { useEffect } from "react"
import { addObjectToGroup } from "@etherealengine/engine/src/scene/components/GroupComponent"
import { Entity } from "@etherealengine/engine/src/ecs/classes/Entity"
import { NameComponent } from "@etherealengine/engine/src/scene/components/NameComponent"
import { EntityUUID } from "@etherealengine/common/src/interfaces/EntityUUID"
import { EntityTreeComponent } from "@etherealengine/engine/src/ecs/functions/EntityTree"
import { VisibleComponent } from "@etherealengine/engine/src/scene/components/VisibleComponent"

export const BubbleComponent = defineComponent({
  //name: The human-readable label for the component. This will be displayed in the editor and debugging tools.
  name: "Bubble Component",
  //jsonID: The serialized name of the component. This is used to identify the component in the serialized scene data
  jsonID: "bubble",
  //onInit: Initializer function that is called when the component is added to an entity. The return type of this function defines the 
  //        schema of the component's runtime data.
  onInit: (entity) => {
    return {
      color: new Color(0xFFFFFF),
      direction: new Vector3(0, 1, 0),
      speed: .1,
      bubble: null as Mesh | null,
      bubbleEntity: null as Entity | null
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
  reactor: () => {
    //get the entity using useEntityContext
    const entity = useEntityContext()

    //get a reactive component state with useComponent
    const bubbleComponent = useComponent(entity, BubbleComponent)

    //a useEffect with no dependencies will only run once, when the component is first initialized
    useEffect(() => {
      const bubbleEntity = createEntity()
      bubbleComponent.bubbleEntity.set(bubbleEntity)
      setComponent(bubbleEntity, VisibleComponent)
      setComponent(bubbleEntity, NameComponent, "Bubble")
      setComponent(bubbleEntity, EntityTreeComponent, {
        parentEntity: entity,
        uuid: MathUtils.generateUUID() as EntityUUID
      })
      const bubbleMesh = new Mesh(new SphereGeometry(), new MeshStandardMaterial())
      bubbleMesh.material.color = bubbleComponent.color.value
      addObjectToGroup(bubbleComponent.bubbleEntity.value!, bubbleMesh)
      bubbleComponent.bubble.set(bubbleMesh)
    }, [])

    //a useEffect with dependencies will run whenever the dependencies change
    useEffect(() => {
      const bubbleMesh = bubbleComponent.bubble.value
      if (!bubbleMesh) return
      const material = bubbleMesh.material as MeshStandardMaterial
      material.color.copy(bubbleComponent.color.value)
    }, [bubbleComponent.color])

    return null
  }
})