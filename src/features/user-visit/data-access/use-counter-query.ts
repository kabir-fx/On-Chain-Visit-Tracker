import { getCounterProgramAccounts } from '@project/anchor'
import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'

export function useCounterQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: ['counter'],
    queryFn: async () => {
      const accounts = await getCounterProgramAccounts(client.rpc)

      // Should only be one global counter, return default if none exists
      const counterData = accounts[0]?.data || { count: 0, bump: 0 }
      return { data: counterData, address: accounts[0]?.address }
    },
  })
}