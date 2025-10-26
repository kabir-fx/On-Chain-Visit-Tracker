import { useSolana } from '@/components/solana/use-solana'

export function useUsersusersusersuserscounterAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['usersusersuserscounter', 'accounts', { cluster }]
}
