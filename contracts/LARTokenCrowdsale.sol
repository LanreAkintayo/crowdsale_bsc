pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";




contract LarTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale, TimedCrowdsale, RefundableCrowdsale {

  constructor(
    uint256 _rate,
    address _wallet,
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
    require(_goal <= _cap, "Your goal cannot be greater than the maximum cap");
  }

   /**
   * @dev enables token transfers, called when owner calls finalize()
  */
  function finalization() internal {
    // Any functionality after the end of the crowdsale is added here.
    if(goalReached()) {
      MintableToken _mintableToken = MintableToken(token);
      _mintableToken.finishMinting();

      // Unpause the token
      PausableToken _pausableToken = PausableToken(token);

      _pausableToken.unpause();
      _pausableToken.transferOwnership(wallet);
    }

    super.finalization();
  }

}