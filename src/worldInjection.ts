import { isClient } from '@etherealengine/common/src/utils/getEnvironment'

/** Ensure bubble system is imported on both client and server */
import './systems/BubbleSystem'

/** Ensure bubble editor is imported only on the client */
export default async function () {
  if (isClient) await import('./editors/RegisterBubbleEditor')
}
