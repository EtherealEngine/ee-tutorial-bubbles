import React from 'react'

import { EditorComponentType, commitProperty, updateProperty } from '@etherealengine/editor/src/components/properties/Util'
import { getComponent, useComponent } from '@etherealengine/engine/src/ecs/functions/ComponentFunctions'
import { BubbleComponent } from '../components/BubbleComponent'
import NodeEditor from '@etherealengine/editor/src/components/properties/NodeEditor'
import InputGroup from '@etherealengine/editor/src/components/inputs/InputGroup'
import { ColorInput } from '@etherealengine/editor/src/components/inputs/ColorInput'
import AlbumIcon from '@mui/icons-material/Album';
import NumericInput from '@etherealengine/editor/src/components/inputs/NumericInput'
import Vector3Input from '@etherealengine/editor/src/components/inputs/Vector3Input'


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
      <InputGroup name="Speed" label="Bubble Speed">
        <NumericInput
          value={bubbleComponent.speed.value}
          onChange={updateProperty(BubbleComponent, 'speed')}
          onRelease={commitProperty(BubbleComponent, 'speed')}
        />
      </InputGroup>
      <InputGroup name="Direction" label="Bubble Direction">
        <Vector3Input
          value={bubbleComponent.direction.value}
          onChange={updateProperty(BubbleComponent, 'direction')}
          onRelease={commitProperty(BubbleComponent, 'direction')}
        />
      </InputGroup>
    </NodeEditor>
}
BubbleNodeEditor.iconComponent = AlbumIcon