import { useQueryClient } from '@tanstack/react-query'
import { useUsersusersusersuserscounterAccountsQueryKey } from './use-usersusersuserscounter-accounts-query-key'

export function useUsersusersusersuserscounterAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useUsersusersusersuserscounterAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
