# crowdsale_bsc
A crowdsale smart contract deployed on binance smart chain that manages how funds are raised during an ICO. Investors invest in the ICO by buying some LARToken (a token deployed on the binance smart chain). The amount of LARToken that will be transferred to the investor is calculated based on the rate and the amount in wei the investor sends.

# Description
The LARToken contract uses some OpenZeppelin contracts that added more functionalities to it.
1. **ERC20Pausable**: The token will have the normal standard features with an additional feature of pausing and unpausing the token. When the token is paused, It will not be able to be used to make any transaction. In other words, investors will not be able to use it for anything other than keeping it. This is what we actually want. The token should not be able to used in any transaction till the crowdsale is over.
2. **ERC20Mintable**: The token will only be produced/minted only when it is needed. That is, the total supply of the token is determined by the number of LARToken minted. 

The LARTokenCrowdsale contract also extends some contracts in the OpenZeppelin library.
1.  **MintedCrowdsale**: This provides the functionality of transferring some minted tokens to the investor buying it.
2.   **CappedCrowdsale**: This provides the functionality of making the LARTokenCrowdsale set a specific goal or amount. In other words, the fund that is needed to be raised can be set. If an investor tries to invest when the goal is reached, LARTokenCrowdsale smartcontract will revert the transaction.
3.   **TimedCrowdsale**: This gives LARTokenCrowdsale the ability to set the duration of the crowdsale. 
4.    **RefundableCrowdsale**: When the crowdsale is over and finalized and the goal is not reached, investors can claim refunds. This is possible as a result of extending the RefundableCrowdsale. 

At the end of the crowdsale, the token is unpaused. So, it will be useful in making any transaction.

# Technologies used
1. Solidity
2. Ganache
3. Truffle framework
4. Javascript
5. Remix
