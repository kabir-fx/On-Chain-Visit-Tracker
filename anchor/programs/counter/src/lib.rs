#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("2jb8Qq7CgGMaE15f6ZTB7UFCMsiD2sUyPyFxru5MEKg9");

#[program]
pub mod usersusersuserscounter {
    use super::*;

    pub fn close(_ctx: Context<CloseUsersusersusersuserscounter>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.usersusersuserscounter.count = ctx.accounts.usersusersuserscounter.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.usersusersuserscounter.count = ctx.accounts.usersusersuserscounter.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeUsersusersusersuserscounter>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.usersusersuserscounter.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUsersusersusersuserscounter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Usersusersusersuserscounter::INIT_SPACE,
  payer = payer
    )]
    pub usersusersuserscounter: Account<'info, Usersusersusersuserscounter>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseUsersusersusersuserscounter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub usersusersuserscounter: Account<'info, Usersusersusersuserscounter>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub usersusersuserscounter: Account<'info, Usersusersusersuserscounter>,
}

#[account]
#[derive(InitSpace)]
pub struct Usersusersusersuserscounter {
    count: u8,
}
