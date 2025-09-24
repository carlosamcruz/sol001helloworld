use anchor_lang::prelude::*;

declare_id!("CLWiPXRY7VVcH9KFYKE6gDSjQrBz4K5fkfy5RF1SLrjr");
//declare_id!("B17oJVNSNBpPN8biebmiub51xqqGqijwWYwPwADNuL5u"); //old key pair


#[program]
pub mod hello_world_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, message: String) -> Result<()> {
        //ctx.accounts.hello_world_account.message = message;

        let acct = &mut ctx.accounts.hello_world_account;
        acct.owner = ctx.accounts.initializer.key();
        acct.message = message;


        Ok(())
    }

    pub fn update(ctx: Context<Update>, new_message: String) -> Result<()> {
        ctx.accounts.hello_world_account.message = new_message;
        Ok(())
    }

    pub fn finalize(ctx: Context<Finalize>) -> Result<()> {
        let acct = &ctx.accounts.hello_world_account;
        //let hello_account = &ctx.accounts.hello_world_account;
        // Check that the message is exactly "finalize"
        require!(acct.message == "finalize", CustomError::InvalidFinalizationMessage);
      
        // Enforce owner-only
        require_keys_eq!(ctx.accounts.owner.key(), acct.owner, CustomError::NotOwner);

        // When this function completes, the `#[account(close = user)]`
        // attribute automatically closes the account.
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = initializer, space = 256)]
    pub hello_world_account: Account<'info, HelloWorldAccount>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub hello_world_account: Account<'info, HelloWorldAccount>,
    pub user: Signer<'info>, // Só para pagar a taxa de transação
}

#[derive(Accounts)]
pub struct Finalize<'info> {
    #[account(mut, close = owner)]
    pub hello_world_account: Account<'info, HelloWorldAccount>,
    /// Owner must sign; rent refunded here
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[account]
pub struct HelloWorldAccount {
    pub owner: Pubkey,
    pub message: String,
}

#[error_code]
pub enum CustomError {
    #[msg("Only the owner can perform this action.")]
    NotOwner,
    #[msg("The account message must be 'finalize' to finalize (close) the account.")]
    InvalidFinalizationMessage,
}