import { UsersusersusersuserscounterAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { UsersusersusersuserscounterUiButtonClose } from './usersusersuserscounter-ui-button-close'
import { UsersusersusersuserscounterUiButtonDecrement } from './usersusersuserscounter-ui-button-decrement'
import { UsersusersusersuserscounterUiButtonIncrement } from './usersusersuserscounter-ui-button-increment'
import { UsersusersusersuserscounterUiButtonSet } from './usersusersuserscounter-ui-button-set'

export function UsersusersusersuserscounterUiCard({ account, usersusersuserscounter }: { account: UiWalletAccount; usersusersuserscounter: UsersusersusersuserscounterAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usersusersusersuserscounter: {usersusersuserscounter.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={usersusersuserscounter.address} label={ellipsify(usersusersuserscounter.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <UsersusersusersuserscounterUiButtonIncrement account={account} usersusersuserscounter={usersusersuserscounter} />
          <UsersusersusersuserscounterUiButtonSet account={account} usersusersuserscounter={usersusersuserscounter} />
          <UsersusersusersuserscounterUiButtonDecrement account={account} usersusersuserscounter={usersusersuserscounter} />
          <UsersusersusersuserscounterUiButtonClose account={account} usersusersuserscounter={usersusersuserscounter} />
        </div>
      </CardContent>
    </Card>
  )
}
