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
import { LocalTransformComponent } from "@etherealengine/engine/src/transform/components/TransformComponent"
import matches from "ts-matches"

export const BubbleComponent = defineComponent({
  //name: The human-readable label for the component. This will be displayed in the editor and debugging tools.
  name: "Bubble Component",

  //onInit: Initializer function that is called when the component is added to an entity. The return type of this function defines the 
  //        schema of the component's runtime data.
  onInit: (entity) => {
    return {
      age: 0 as number
    }
  },
  //onSet: Set function that is called whenever the component's data is updated via the setComponent function. This is where deserialize logic should
  //       be applied.
  onSet: (entity, component, json) => {
    if (!json) return
    matches.number.test(json.age) && component.age.set(json.age)
  },
  //toJSON: Serializer function that is called when the component is being saved to a scene file or snapshot. This is where serialize logic should
  //       be applied to convert the component's runtime data into a JSON object.
  toJSON: (entity, component) => {
    return {
      age: component.age.value
    }
  },
  //reactor: The reactor function is where async reactive logic is defined. Any side-effects that depend upon component data should be defined here.
  reactor: () => {
    //get the entity using useEntityContext
    const entity = useEntityContext()

    //a useEffect with no dependencies will only run once, when the component is first initialized
    useEffect(() => {
      setComponent(entity, VisibleComponent) // Set if the entity is visible
      setComponent(entity, NameComponent, "Bubble") // Give the entity a name
      setComponent(entity, LocalTransformComponent) // Give the entity a local transform
      const bubbleMesh = new Mesh(new SphereGeometry(), new MeshStandardMaterial())
      bubbleMesh.material.color = new Color(0xFFFFFF)
      addObjectToGroup(entity, bubbleMesh) // Add GroupComponent and add mesh to Group
    }, [])

    return null
  }
})