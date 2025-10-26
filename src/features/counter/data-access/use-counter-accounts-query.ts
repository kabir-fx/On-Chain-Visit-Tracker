import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getUsersusersusersuserscounterProgramAccounts } from '@project/anchor'
import { useUsersusersusersuserscounterAccountsQueryKey } from './use-usersusersuserscounter-accounts-query-key'

export function useUsersusersusersuserscounterAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useUsersusersusersuserscounterAccountsQueryKey(),
    queryFn: async () => await getUsersusersusersuserscounterProgramAccounts(client.rpc),
  })
}
