import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { UiWalletAccount } from '@wallet-ui/react'
import { getProgramDerivedAddress, getAddressEncoder, getBytesEncoder, address } from 'gill'
import { COUNTER_PROGRAM_ADDRESS } from '@project/anchor'

export function useUserVisitQuery(account?: UiWalletAccount) {
  const { client } = useSolana()

  return useQuery({
    queryKey: ['user-visit', account?.address],
    queryFn: async () => {
      if (!account) return null

      // Derive the user visit PDA address
      const userVisitPda = await getProgramDerivedAddress({
        programAddress: COUNTER_PROGRAM_ADDRESS,
        seeds: [
          getBytesEncoder().encode(new Uint8Array([117, 115, 101, 114, 95, 118, 105, 115, 105, 116])), // "user_visit"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getAddressEncoder().encode(address(account.address)),
        ],
      })

      // Try to fetch the account
      try {
        const accountInfo = await client.rpc.getAccountInfo(userVisitPda[0]).send()
        return accountInfo.value ? { hasVisited: true } : { hasVisited: false }
      } catch {
        // Account doesn't exist, so user hasn't visited
        return { hasVisited: false }
      }
    },
    enabled: !!account,
  })
}