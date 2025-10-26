import { USERSUSERSUSERSCOUNTER_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function CounterUiProgramExplorerLink() {
  return <AppExplorerLink address={USERSUSERSUSERSCOUNTER_PROGRAM_ADDRESS} label={ellipsify(USERSUSERSUSERSCOUNTER_PROGRAM_ADDRESS)} />
}
