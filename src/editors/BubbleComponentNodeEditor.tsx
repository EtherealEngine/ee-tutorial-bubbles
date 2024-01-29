import React from 'react'

import { EditorComponentType, commitProperty, updateProperty } from '@etherealengine/editor/src/components/properties/Util'
import { BubbleEmitterComponent } from '../components/BubbleEmitterComponent'
import NodeEditor from '@etherealengine/editor/src/components/properties/NodeEditor'
import InputGroup from '@etherealengine/editor/src/components/inputs/InputGroup'
import { ColorInput } from '@etherealengine/editor/src/components/inputs/ColorInput'
import AlbumIcon from '@mui/icons-material/Album';
import NumericInput from '@etherealengine/editor/src/components/inputs/NumericInput'
import Vector3Input from '@etherealengine/editor/src/components/inputs/Vector3Input'
import { useComponent } from '@etherealengine/ecs'

export const BubbleNodeEditor: EditorComponentType = (props) => {
  const emitterComponent = useComponent(props.entity, BubbleEmitterComponent)
  return <NodeEditor description={'Description'} {...props}>
      <InputGroup name="Color" label="Bubble Color">
        <ColorInput
          value={emitterComponent.color.value}
          onChange={updateProperty(BubbleEmitterComponent, 'color')}
          onRelease={commitProperty(BubbleEmitterComponent, 'color')}
        />
      </InputGroup>
      <InputGroup name="Speed" label="Bubble Speed">
        <NumericInput
          value={emitterComponent.speed.value}
          onChange={updateProperty(BubbleEmitterComponent, 'speed')}
          onRelease={commitProperty(BubbleEmitterComponent, 'speed')}
        />
      </InputGroup>
      <InputGroup name="Direction" label="Bubble Direction">
        <Vector3Input
          value={emitterComponent.direction.value}
          onChange={updateProperty(BubbleEmitterComponent, 'direction')}
          onRelease={commitProperty(BubbleEmitterComponent, 'direction')}
        />
      </InputGroup>
    </NodeEditor>
}
BubbleNodeEditor.iconComponent = AlbumIcon