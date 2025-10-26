import { UsersusersusersuserscounterAccount, getCloseInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useUsersusersusersuserscounterAccountsInvalidate } from './use-usersusersuserscounter-accounts-invalidate'

export function useUsersusersusersuserscounterCloseMutation({ account, usersusersuserscounter }: { account: UiWalletAccount; usersusersuserscounter: UsersusersusersuserscounterAccount }) {
  const invalidateAccounts = useUsersusersusersuserscounterAccountsInvalidate()
  const signAndSend = useWalletUiSignAndSend()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, usersusersuserscounter: usersusersuserscounter.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
