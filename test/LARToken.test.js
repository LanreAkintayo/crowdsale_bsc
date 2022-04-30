const BN = require('bn.js');

const LARToken = artifacts.require('LARToken');

require('chai')
  .use(require('chai-bn')(BN))
  .should();

contract('LARToken', accounts => {
  const _name = 'LAR Token';
  const _symbol = 'LAR';
  const _decimals = 18;

  beforeEach(async function () {
    this.token = await LARToken.new(_name, _symbol, _decimals);
  });

  describe('token attributes', function() {
    it('has the correct name', async function() {
      const name = await this.token.name();
      name.should.equal(_name);
    });

    it('has the correct symbol', async function() {
      const symbol = await this.token.symbol();
      symbol.should.equal(_symbol);
    });

    it('has the correct decimals', async function() {
      const decimals = await this.token.decimals();
      assert.equal(_decimals, decimals)
    });
  });
 
 
});