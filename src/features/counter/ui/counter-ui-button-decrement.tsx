import { UsersusersusersuserscounterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useCounterDecrementMutation } from '../data-access/use-counter-decrement-mutation'

export function CounterUiButtonDecrement({ account, counter }: { account: UiWalletAccount; counter: UsersusersusersuserscounterAccount }) {
  const decrementMutation = useCounterDecrementMutation({ account, counter })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
