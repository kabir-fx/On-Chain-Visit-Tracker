import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useUsersusersusersuserscounterInitializeMutation } from '@/features/usersusersuserscounter/data-access/use-usersusersuserscounter-initialize-mutation'

export function UsersusersusersuserscounterUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useUsersusersusersuserscounterInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Usersusersusersuserscounter {mutationInitialize.isPending && '...'}
    </Button>
  )
}
