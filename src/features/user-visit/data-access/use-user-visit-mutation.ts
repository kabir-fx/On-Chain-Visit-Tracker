import { getCounterProgramAccounts, getInitializeCounterInstruction, getMarkUserVisitInstruction } from '@project/anchor'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useSolana } from '@/components/solana/use-solana'
import { COUNTER_PROGRAM_ADDRESS } from '@project/anchor'
import { getProgramDerivedAddress, getBytesEncoder, address, getAddressEncoder } from 'gill'
import { toast } from 'sonner'

export function useUserVisitMutation(account: UiWalletAccount) {
    const { client } = useSolana()
    const signAndSend = useWalletUiSignAndSend()
    const signer = useWalletUiSigner({ account })

    return useMutation({
        mutationFn: async () => {
            // Check if counter exists
            const counterAccounts = await getCounterProgramAccounts(client.rpc)

            let counterAddress: string

            if (counterAccounts.length === 0) {
                console.log("Counter does not exist - creating one...")

                // Derive the counter PDA address using the same seeds as program
                const counterPda = await getProgramDerivedAddress({
                    programAddress: COUNTER_PROGRAM_ADDRESS,
                    seeds: [new Uint8Array(Buffer.from('counter'))],
                })
                counterAddress = counterPda[0]

                // Initialize counter
                const initIx = getInitializeCounterInstruction({
                    payer: signer,
                    counter: address(counterAddress),
                })

                await signAndSend(initIx, signer)

            } else {
                counterAddress = counterAccounts[0].address
            }

            // Fetch user PDA
            const userVistPda = await getProgramDerivedAddress({
                programAddress: COUNTER_PROGRAM_ADDRESS,
                seeds: [
                    getBytesEncoder().encode(new Uint8Array(Buffer.from('user_visit'))),

                    // Encode the address as Uint8Array
                    getAddressEncoder().encode(signer.address),
                ]
            })

            // Now record the visit
            const visitIx = getMarkUserVisitInstruction({
                user: signer,
                counter: address(counterAddress),
                userVisit: userVistPda[0]
            })

            return await signAndSend(visitIx, signer)
        },
        onSuccess: async (tx) => {
            toastTx(tx)

            setTimeout(() => {
                window.location.reload()
            }, 2000)
            
        },
        onError: (error) => {
            console.error('Visit recording failed:', error)

            toast.error('Insufficient SOL balance. Please add more SOL to your wallet and try again.')
        }
    })
}