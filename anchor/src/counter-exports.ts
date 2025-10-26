// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Usersusersusersuserscounter, USERSCOUNTER_DISCRIMINATOR, USERSCOUNTER_PROGRAM_ADDRESS, getUsersusersusersuserscounterDecoder } from './client/js'
import UsersusersusersuserscounterIDL from '../target/idl/usersusersuserscounter.json'

export type UsersusersusersuserscounterAccount = Account<Usersusersusersuserscounter, string>

// Re-export the generated IDL and type
export { UsersusersusersuserscounterIDL }

export * from './client/js'

export function getUsersusersusersuserscounterProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getUsersusersusersuserscounterDecoder(),
    filter: getBase58Decoder().decode(USERSCOUNTER_DISCRIMINATOR),
    programAddress: USERSCOUNTER_PROGRAM_ADDRESS,
  })
}
