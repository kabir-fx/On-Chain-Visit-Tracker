import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { UsersusersusersuserscounterUiButtonInitialize } from './ui/usersusersuserscounter-ui-button-initialize'
import { UsersusersusersuserscounterUiList } from './ui/usersusersuserscounter-ui-list'
import { UsersusersusersuserscounterUiProgramExplorerLink } from './ui/usersusersuserscounter-ui-program-explorer-link'
import { UsersusersusersuserscounterUiProgramGuard } from './ui/usersusersuserscounter-ui-program-guard'

export default function UsersusersusersuserscounterFeature() {
  const { account } = useSolana()

  return (
    <UsersusersusersuserscounterUiProgramGuard>
      <AppHero
        title="Usersusersusersuserscounter"
        subtitle={
          account
            ? "Initialize a new usersusersuserscounter onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <UsersusersusersuserscounterUiProgramExplorerLink />
        </p>
        {account ? (
          <UsersusersusersuserscounterUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <UsersusersusersuserscounterUiList account={account} /> : null}
    </UsersusersusersuserscounterUiProgramGuard>
  )
}
