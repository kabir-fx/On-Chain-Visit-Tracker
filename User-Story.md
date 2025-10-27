# Decentralised Website Visit Counter

## Project Name: On-Chain Visit Tracker

## Value Proposition:
Our decentralized user visits counter is a simple Anchor smart contract that manages a counter value stored on Solana's blockchain. The core idea is to create a tamper-proof, on-chain tracker for website visits, replacing or supplementing traditional analytical tools.

## Product-Market Fit:
In order to display the lifetime user counts on the website developers need to either rely on the external analytical tools or generate a similar global count component. But on choosing the latter option, it always creates a feeling of distrust among the users as there is no way for them to actually verify this claim.

Our platform addresses these concerns by using a decentralised approach and utilizing blockchain's core privacy features. Here, all user entries are pseudonymous, as blockchains don't natively store any private information on-chain. This approach eliminates the need for a centralized analytical tool.

A decentralized approach also has another huge advantage, as all data is stored on-chain anyone can verify it using a Solana Explorer. This builds user trust and ensures that there are no synthetic numbers being presented on the platform.

This platform is more of a proof-of-concept to be utilized in other dApps as a feature.

## Targeted User Profiles:
- The "Tech Enthusiast" User - This user is interested in blockchain and web3 innovations; they enjoy interactive features like signing transactions to contribute to on-chain metrics and exploring data via blockchain explorers.

- The "Privacy-Consious" User - This user is concerned about data privacy and online tracking, they value platforms that provide transparency and enable user trust.

## User Story ID: ADV-001

### 1. User Persona
#### Name: Eren
#### Role: Community Member
#### Goal: The user wants to visit the website and mark their visit as a contribution to the community.

### 2. User Story: As a website visitor, I want to mark my visit by incrementing the count of user visits, so that I can engage with the community and contribute to verifiable metrics.

### 3. Acceptance Criteria
#### Functionality
- The platform allows users to connect their wallets.
- After the wallet is connected, users can sign a transaction to mark their visit.
- If a user signs the transaction, then the global count of the counter should increase.

#### Global Counter Attributes
- The counter stores the global count of all visits from unique users that have contributed to the website.
- The counter should be able to increment once a user signs the instruction.

#### User Interactions
- Users can view the global count of the website.
- Users can sign a transaction to increment the global count.
- Users can verify the global count using a Solana explorer.

#### Security
- Global count should be verifiable and tamper-proof on the blockchain.

### 4. Priority: High

### 5. Technical Notes (for Developers)

#### Dependencies:
- This story requires a mechanism to interact with the user's wallet, so that the said user can sign the transaction.
- It needs a counter functionality that is capable of incrementing the global count once a user signs the transaction.

#### Considerations:
- Implement a robust counter mechanism that can be verified by all users.
- Ensure that the same user's wallet is not allowed to sign the transaction again.
