import { UsersusersusersuserscounterAccount, getIncrementInstruction } from '@project/anchor'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useUsersusersusersuserscounterAccountsInvalidate } from './use-usersusersuserscounter-accounts-invalidate'

export function useUsersusersusersuserscounterIncrementMutation({
  account,
  usersusersuserscounter,
}: {
  account: UiWalletAccount
  usersusersuserscounter: UsersusersusersuserscounterAccount
}) {
  const invalidateAccounts = useUsersusersusersuserscounterAccountsInvalidate()
  const signAndSend = useWalletUiSignAndSend()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ usersusersuserscounter: usersusersuserscounter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
