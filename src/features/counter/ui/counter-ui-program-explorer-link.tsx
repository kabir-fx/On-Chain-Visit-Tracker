import { USERSCOUNTER_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function UsersusersusersuserscounterUiProgramExplorerLink() {
  return <AppExplorerLink address={USERSCOUNTER_PROGRAM_ADDRESS} label={ellipsify(USERSCOUNTER_PROGRAM_ADDRESS)} />
}
