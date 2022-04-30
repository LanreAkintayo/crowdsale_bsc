pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


// import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
// import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
// import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
// import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
// import "openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";




contract LarTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale, TimedCrowdsale, RefundableCrowdsale {

  address tokenAddress;

  constructor(
    uint256 _rate,
    address payable _wallet,
    ERC20 _token,
    uint256 _cap,
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _goal
  )
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
    TimedCrowdsale(_openingTime, _closingTime)
    RefundableCrowdsale(_goal)
    public
  {
    tokenAddress = address(_token);
    require(_goal <= _cap, "Your goal cannot be greater than the maximum cap");

  }

   /**
   * @dev enables token transfers, called when owner calls finalize()
  */
  function _finalization() internal {
    // Any functionality after the end of the crowdsale is added here.
    if(goalReached()) {

      // Unpause the token
      ERC20Pausable(tokenAddress).unpause();

    }

    super._finalization();
  }

}