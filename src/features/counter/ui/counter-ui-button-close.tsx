import { UsersusersusersuserscounterAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useUsersusersusersuserscounterCloseMutation } from '@/features/usersusersuserscounter/data-access/use-usersusersuserscounter-close-mutation'

export function UsersusersusersuserscounterUiButtonClose({ account, usersusersuserscounter }: { account: UiWalletAccount; usersusersuserscounter: UsersusersusersuserscounterAccount }) {
  const closeMutation = useUsersusersusersuserscounterCloseMutation({ account, usersusersuserscounter })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
