import { UsersusersusersuserscounterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useUsersusersusersuserscounterIncrementMutation } from '../data-access/use-usersusersuserscounter-increment-mutation'

export function UsersusersusersuserscounterUiButtonIncrement({ account, usersusersuserscounter }: { account: UiWalletAccount; usersusersuserscounter: UsersusersusersuserscounterAccount }) {
  const incrementMutation = useUsersusersusersuserscounterIncrementMutation({ account, usersusersuserscounter })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
