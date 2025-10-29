// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Counter, COUNTER_DISCRIMINATOR, COUNTER_PROGRAM_ADDRESS, getCounterDecoder } from './client/js'
import CounterIDL from '../target/idl/counter.json'

// Re-export the generated IDL and type
export { CounterIDL }
export { COUNTER_PROGRAM_ADDRESS }

// Explicitly export instruction functions
export { getInitializeCounterInstruction, getInitializeCounterInstructionAsync } from './client/js/generated/instructions/initializeCounter'
export { getMarkUserVisitInstruction, getMarkUserVisitInstructionAsync } from './client/js/generated/instructions/markUserVisit'

export type CounterAccount = Account<Counter, string>

export function getCounterProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getCounterDecoder(),
    filter: getBase58Decoder().decode(COUNTER_DISCRIMINATOR),
    programAddress: COUNTER_PROGRAM_ADDRESS,
  })
}