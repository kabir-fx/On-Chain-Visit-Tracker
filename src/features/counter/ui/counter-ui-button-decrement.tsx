import { UsersusersusersuserscounterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useUsersusersusersuserscounterDecrementMutation } from '../data-access/use-usersusersuserscounter-decrement-mutation'

export function UsersusersusersuserscounterUiButtonDecrement({ account, usersusersuserscounter }: { account: UiWalletAccount; usersusersuserscounter: UsersusersusersuserscounterAccount }) {
  const decrementMutation = useUsersusersusersuserscounterDecrementMutation({ account, usersusersuserscounter })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
