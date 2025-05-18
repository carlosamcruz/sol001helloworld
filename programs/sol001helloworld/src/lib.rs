use anchor_lang::prelude::*;

declare_id!("CLWiPXRY7VVcH9KFYKE6gDSjQrBz4K5fkfy5RF1SLrjr");
//declare_id!("B17oJVNSNBpPN8biebmiub51xqqGqijwWYwPwADNuL5u"); //old key pair


#[program]
pub mod hello_world_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, message: String) -> Result<()> {
        ctx.accounts.hello_world_account.message = message;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, new_message: String) -> Result<()> {
        ctx.accounts.hello_world_account.message = new_message;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32)]
    pub hello_world_account: Account<'info, HelloWorldAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub hello_world_account: Account<'info, HelloWorldAccount>,
    pub user: Signer<'info>, // Só para pagar a taxa de transação
}

#[account]
pub struct HelloWorldAccount {
    pub message: String,
}