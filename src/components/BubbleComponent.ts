import { defineComponent, setComponent, useEntityContext } from '@etherealengine/ecs'

import { Color, Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import matches from 'ts-matches'

import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { addObjectToGroup } from '@etherealengine/spatial/src/renderer/components/GroupComponent'
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent'
import { TransformComponent } from '@etherealengine/spatial/src/transform/components/TransformComponent'
import { useEffect } from 'react'

export const BubbleComponent = defineComponent({
  /** name: The human-readable label for the component. This will be displayed in the editor and debugging tools. */
  name: 'Bubble Component',

  /**
   * onInit: Initializer function that is called when the component is added to an entity.
   * The return type of this function defines the schema of the component's runtime data.
   */       
  onInit: (entity) => {
    return {
      age: 0 as number
    }
  },

  /**
   * onSet: Set function that is called whenever setComponent is called. 
   * This is where deserialize logic should be applied.
   */
  onSet: (entity, component, json) => {
    if (!json) return
    matches.number.test(json.age) && component.age.set(json.age)
  },

  /**
   * toJSON: Serializer function that is called when the component is being saved to a scene file or snapshot. 
   * This is where serialize logic should be applied to convert the component's runtime data into a JSON object.
   */
  toJSON: (entity, component) => {
    return {
      age: component.age.value
    }
  },
  /**
   * reactor: The reactor function is where async reactive logic is defined. Any side-effects that depend upon component data should be defined here.
   */
  reactor: () => {
    /** Get the entity for this component instance */
    const entity = useEntityContext()

    /** A useEffect with no dependencies will only run once, when the component is first initialized */
    useEffect(() => {
      /** Set if the entity is visible */
      setComponent(entity, VisibleComponent)
      /** Set the name of the entity */
      setComponent(entity, NameComponent, 'Bubble')
      /** Give the entity a local transform */
      setComponent(entity, TransformComponent)
      /** Add a mesh to the object */
      const bubbleMesh = new Mesh(new SphereGeometry(), new MeshStandardMaterial())
      bubbleMesh.material.color = new Color(0xffffff)
      addObjectToGroup(entity, bubbleMesh)
    }, [])

    return null
  }
})
