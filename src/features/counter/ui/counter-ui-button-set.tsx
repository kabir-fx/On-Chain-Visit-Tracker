import { UsersusersusersuserscounterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useUsersusersusersuserscounterSetMutation } from '@/features/usersusersuserscounter/data-access/use-usersusersuserscounter-set-mutation'

export function UsersusersusersuserscounterUiButtonSet({ account, usersusersuserscounter }: { account: UiWalletAccount; usersusersuserscounter: UsersusersusersuserscounterAccount }) {
  const setMutation = useUsersusersusersuserscounterSetMutation({ account, usersusersuserscounter })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', usersusersuserscounter.data.count.toString() ?? '0')
        if (!value || parseInt(value) === usersusersuserscounter.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}
