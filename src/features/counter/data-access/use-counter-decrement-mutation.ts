import { UsersusersusersuserscounterAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useUsersusersusersuserscounterAccountsInvalidate } from './use-usersusersuserscounter-accounts-invalidate'

export function useUsersusersusersuserscounterDecrementMutation({
  account,
  usersusersuserscounter,
}: {
  account: UiWalletAccount
  usersusersuserscounter: UsersusersusersuserscounterAccount
}) {
  const invalidateAccounts = useUsersusersusersuserscounterAccountsInvalidate()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ usersusersuserscounter: usersusersuserscounter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
