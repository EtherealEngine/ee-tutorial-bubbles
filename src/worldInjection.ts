import { isClient } from '@etherealengine/common/src/utils/getEnvironment'

/** Ensure bubble system is imported */
import './systems/BubbleSystem'

/** Ensure bubble editor is imported only on the client */
if (isClient) import('./editors/RegisterBubbleEditor')

export default async function worldInjection() {}
