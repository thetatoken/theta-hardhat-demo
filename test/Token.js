// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Note: Ethers.js seems to compute the deployment address of a smart contract via the following formula, instead
    //       of reading it from the ETH RPC response:
    //
    //               contract_addr = sha3(rlp.encode([deployer_address, nonce]))[12:]
    //
    //       Note that Theta's account sequence starts from 1, while Ethereum's account sequence (i.e. nonce) 
    //       starts from 0. Due to this "off-by-one" discrepancy, the token address calculated by ethers.js does not match
    //       with the deployed contract. A **work-around is to deploy each contract twice**. Since the sequence/nonce
    //       increments by 1 each time, the second deployment will deploy the contract to the address calcualted by 
    //       ethers.js. The following pseudo code illustrates the work-around:
    //
    //                token = await Token.Deploy()
    //                tokenAddr = token.address        // tokenAddr is calculated by ethers.js with an "off-by-one" nonce
    //                tokenCopy = await Token.Deploy() // tokenCopy is deployed to tokenAddr

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await Token.deploy();
    await hardhatToken.deployed();

    // We can interact with the contract by calling `hardhatToken.method()`
    var hardhatTokenCopy = await Token.deploy(); // see the note above, deploy hardhatToken again as a work-around for the address mismatch issue  
    await hardhatTokenCopy.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      // await expect(
      //   hardhatToken.connect(addr1).transfer(owner.address, 1)
      // ).to.be.revertedWith("Not enough tokens");

      await hardhatToken.connect(addr1).transfer(owner.address, 1)

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      // Transfer 100 tokens from owner to addr1.
      await hardhatToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await hardhatToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await hardhatToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  });
});
