import { UsersusersusersuserscounterAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useCounterAccountsInvalidate } from './use-counter-accounts-invalidate'

export function useCounterDecrementMutation({
  account,
  counter,
}: {
  account: UiWalletAccount
  counter: UsersusersusersuserscounterAccount
}) {
  const invalidateAccounts = useCounterAccountsInvalidate()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ usersusersuserscounter: counter.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
