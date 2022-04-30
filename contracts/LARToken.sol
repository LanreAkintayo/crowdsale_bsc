pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

// import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract LARToken is  ERC20Mintable, ERC20Pausable, ERC20Detailed {
    constructor(string memory _name, string memory _symbol, uint8 _decimals)
        ERC20Detailed(_name, _symbol, _decimals)
        public
    {

    }
}