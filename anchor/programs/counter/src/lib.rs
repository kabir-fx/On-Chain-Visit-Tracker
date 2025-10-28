//! # Decentralized User Visit Counter
//!
//! This Anchor program implements a tamper-proof, on-chain website visit counter that tracks
//! the count of unique users who visit the website. The program ensures that each
//! wallet address can only increment the global counter once, providing verifiable metrics
//! without requiring centralized analytics.
//!
//! ## Key Features
//!
//! - **Unique Visit Tracking**: Each wallet can only record one visit
//! - **Global Counter**: Single, tamper-proof counter visible to all users
//! - **Blockchain Verifiability**: All data is stored on-chain and publicly verifiable
//! - **Privacy-Preserving**: No personal data stored, only pseudonymous visit records
//!
//! ## Program Architecture
//!
//! The program uses two types of Program Derived Addresses (PDAs):
//!
//! 1. **Global Counter PDA**: `["counter"]` - Single account storing total visit count
//! 2. **User Visit PDAs**: `["user_visit", user_pubkey]` - Individual tracking per wallet
//!
//! ## Security Model
//!
//! - PDAs prevent duplicate visits from the same wallet
//! - Program-owned accounts ensure data integrity
//! - Checked arithmetic prevents overflow attacks

#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

// The program's unique identifier on Solana's network
// This is the public key of the program account after deployment
declare_id!("4iTkCvhwbbYUvobnobkFN3LkDRiZm1yZoCtvTD2wsKnG");

/// Main program module containing all instruction handlers
///
/// This module defines the business logic for the user visit counter.
/// It provides two main operations: initializing the global counter and
/// recording user visits.
#[program]
pub mod counter {
    use super::*;
    
    /// Initialize the global visit counter
    ///
    /// This instruction must be called once to create the global counter account.
    /// It sets up the PDA that will store the total number of unique visits.
    ///
    /// # Arguments
    /// * `ctx` - The instruction context containing accounts and program state
    ///
    /// # Accounts Required
    /// * `payer` - The account paying for account creation (must be signer)
    /// * `counter` - The global counter PDA (will be created)
    /// * `system_program` - Required for account creation
    ///
    /// # Returns
    /// * `Result<()>` - Success or an error if initialization fails
    ///
    /// # Security
    /// - Only one global counter can exist due to PDA seed constraints
    /// - Payer must sign the transaction
    pub fn initialize_counter(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;

        // Initialize counter to zero visits
        counter.count = 0;

        // Store the bump seed for future PDA derivations
        // This bump ensures we can recreate the same PDA address
        counter.bump = ctx.bumps.counter;
        
        msg!("Global visit counter initialized with 0 visits");
        Ok(())
    }

    /// Record a user's visit to the website
    ///
    /// This instruction allows a user to record their website visit by incrementing
    /// the global counter. Each wallet address can only call this once due to
    /// the unique UserVisit PDA constraint.
    ///
    /// # Arguments
    /// * `ctx` - The instruction context containing accounts and program state
    ///
    /// # Accounts Required
    /// * `user` - The visitor's wallet (must be signer)
    /// * `counter` - The global counter PDA (will be incremented)
    /// * `user_visit` - The user's visit tracking PDA (will be created/updated)
    /// * `system_program` - Required for account creation
    ///
    /// # Returns
    /// * `Result<()>` - Success or AlreadyVisited error
    ///
    /// # Security
    /// - Prevents duplicate visits from same wallet
    /// - Uses checked arithmetic to prevent overflow
    /// - Validates PDA ownership and seeds
    pub fn mark_user_visit(ctx: Context<Visit>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        let user = &mut ctx.accounts.user_visit;

        // Prevent duplicate visits
        // If this account already exists and has_visited is true,
        // the user has already recorded their visit
        if user.has_visited {
            msg!("User {} has already visited", ctx.accounts.user.key());
            return err!(ErrorCode::AlreadyVisited);
        }

        // Mark this user as having visited
        // This creates an immutable record that prevents future visits
        user.has_visited = true;
        user.user = ctx.accounts.user.key();
        user.bump = ctx.bumps.user_visit;

        // Safely increment counter with overflow protection
        counter.count = counter.count
            .checked_add(1)
            .ok_or(ErrorCode::IncrementFailed)?;
        
        msg!("User {} recorded visit #{}", ctx.accounts.user.key(), counter.count);
        Ok(())
    }
}

/// The global counter account data structure
///
/// This account stores the total number of unique website visits.
/// It's a single, program-owned account that serves as the source of truth
/// for visit metrics.
#[account]
#[derive(InitSpace)] // Automatically calculates space needed
pub struct Counter {
    /// Total number of unique visits recorded
    /// Uses u64 to support large numbers (up to ~18 quintillion)
    pub count: u64,
    
    /// Bump seed for PDA address derivation
    /// Stored to enable future PDA address recreation
    /// Range: 0-255
    pub bump: u8,
}

/// Accounts required for initializing the global counter
///
/// This struct defines the accounts needed to set up the user visit counter.
#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    /// The account that will pay for creating the counter account
    /// Must be a signer to authorize the transaction
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The global counter account that will store the total visit count
    /// 
    /// # PDA Details
    /// - Seeds: `["counter"]`
    /// - Created with `init` constraint (fails if account already exists)
    /// - Bump seed stored in the account for future reference
    /// - Space allocated: 8 (discriminator) + Counter::INIT_SPACE
    #[account(
        init,
        payer = payer,
        space = 8 + Counter::INIT_SPACE,
        seeds = [b"counter"],
        bump
    )]
    pub counter: Account<'info, Counter>,

    /// The Solana System Program
    /// Required for creating new accounts on the blockchain
    pub system_program: Program<'info, System>,
}

/// User-specific visit tracking account data structure
/// 
/// Each wallet gets one of these accounts to track whether
/// they have visited the website. This prevents duplicated visit counting.
#[account]
#[derive(InitSpace)]
pub struct UserVisit {
    /// The wallet address of the user
    /// Stored for verification and potential analytics
    pub user: Pubkey,

    /// Boolean flag indicating if this user has visited
    /// Once set to true, cannot be changed (prevents duplicates)
    pub has_visited: bool,

    /// Bump seed for this user's PDA
    /// Allows deterministic address creation using this user's tracking account
    pub bump: u8,
}

/// Accounts required for recording a user visit
/// 
/// This struct defines the accounts needed when a user wants to record
/// their website visit. It includes both the global counter and user-specific tracking.
#[derive(Accounts)]
pub struct Visit<'info> {
    /// The wallet address of the user recording their visit
    /// Must be a signer to prove ownership and prevent spoofing
    #[account(mut)]
    pub user: Signer<'info>,

    /// The global counter account that tracks total unique visits
    /// 
    /// # PDA Verification
    /// - Seeds: `["counter"]`
    /// - Must exist (created by initialize instruction)
    /// - Bump verified against stored value for security
    #[account(
        // Account will be modified (count incremented)
        mut,
        // Same seed as Initialize
        seeds = [b"counter"],
        // Use stored bump for verification
        bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
    
    /// The user-specific visit tracking account
    /// 
    /// # PDA Details
    /// - Seeds: `["user_visit", user_pubkey]`
    /// - Created per user to track their visit status
    /// - `init_if_needed` allows first-time creation but reuses existing accounts
    /// - Prevents duplicate visits from same wallet
    #[account(
        // Create if doesn't exist, use if it does
        init_if_needed,
        // User pays for their own tracking account
        payer = user,
        // Account size with discriminator
        space = 8 + UserVisit::INIT_SPACE,
        // Unique per user
        seeds = [b"user_visit", user.key().as_ref()],
        // Store bump for future verification
        bump
    )]
    pub user_visit: Account<'info, UserVisit>,

    /// The Solana System Program
    /// Required for creating new user visit accounts
    pub system_program: Program<'info, System>,
}

/// Custom error codes for the program
///
/// These errors provide specific, meaningful messages when
/// the operation fails.
#[error_code]
pub enum ErrorCode {
    /// Returned when a user attempts to record a visit
    /// but has already visited (duplicate prevention)
    #[msg("User has already visited - each wallet can only record one visit")]
    AlreadyVisited,

    /// Returned when counter increment would cause overflow
    /// This should never happen in practice as u64 supports up to 18+ quintillion visits
    #[msg("Failed to increment the global visit count - counter overflow")]
    IncrementFailed,
}