import React from 'react'

import { EditorComponentType, commitProperty, updateProperty } from '@etherealengine/editor/src/components/properties/Util'
import { getComponent, useComponent } from '@etherealengine/engine/src/ecs/functions/ComponentFunctions'
import { BubbleComponent } from '../components/BubbleComponent'
import NodeEditor from '@etherealengine/editor/src/components/properties/NodeEditor'
import InputGroup from '@etherealengine/editor/src/components/inputs/InputGroup'
import { ColorInput } from '@etherealengine/editor/src/components/inputs/ColorInput'


export const BubbleNodeEditor: EditorComponentType = (props) => {
  const bubbleComponent = useComponent(props.entity, BubbleComponent)
  return <NodeEditor description={'Description'} {...props}>
      <InputGroup name="Color" label="Bubble Color">
        <ColorInput
          value={bubbleComponent.color.value}
          onChange={updateProperty(BubbleComponent, 'color')}
          onRelease={commitProperty(BubbleComponent, 'color')}
        />
      </InputGroup>
    </NodeEditor>
}