import { UsersusersusersuserscounterUiCard } from './usersusersuserscounter-ui-card'
import { useUsersusersusersuserscounterAccountsQuery } from '@/features/usersusersuserscounter/data-access/use-usersusersuserscounter-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function UsersusersusersuserscounterUiList({ account }: { account: UiWalletAccount }) {
  const usersusersuserscounterAccountsQuery = useUsersusersusersuserscounterAccountsQuery()

  if (usersusersuserscounterAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!usersusersuserscounterAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {usersusersuserscounterAccountsQuery.data?.map((usersusersuserscounter) => (
        <UsersusersusersuserscounterUiCard account={account} key={usersusersuserscounter.address} usersusersuserscounter={usersusersuserscounter} />
      ))}
    </div>
  )
}
