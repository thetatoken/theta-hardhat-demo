# Theta Hardhat Demo

This repository contains a sample project that you can use as the starting point for your Theta DApp project development with the [Hardhat suite](https://hardhat.org/getting-started/).

# Deployment and Testing against Theta Local Privatenet

## Setup the Hardhat demo project

The first things you need to do are cloning this repository and installing its dependencies:

```sh
git clone https://github.com/thetatoken/theta-hardhat-demo
cd theta-hardhat-demo
npm install
```

## Setup Theta local privatenet

Once installed, let's setup the Theta local privatenet with the Theta/Ethereum RPC Adaptor [following this guide](https://docs.thetatoken.org/docs/setup-local-theta-ethereum-rpc-adaptor). The ETH RPC adaptor running at `http://localhost:18888/rpc` interacts with the Web3.js library by translating the Theta RPC interface into the ETH RPC interface.


## Fund the test accounts with some TFuel

Execute the two commands below to fun the test accounts with some TFuel:

```sh
export SEQ=`thetacli query account --address=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab | grep sequence | grep -o '[[:digit:]]\+'`

thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A --tfuel=1000 --password=qwertyuiop --seq=$(($SEQ+1))

thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x1563915e194D8CfBA1943570603F7606A3115508 --tfuel=1000 --password=qwertyuiop --seq=$(($SEQ+2))
```

## Deploy the contract to the local privatenet

Then, on a new terminal, go to the repository's root folder and run this to deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network theta_privatenet
```

## Run the unit tests against the local privatenet

```sh
npx hardhat test --network theta_privatenet
```

## Run the frontend

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

# Deploy to the Theta Mainnet

First, edit the `hardhat.config.js` file, replace `"11...1"` with the actual private key of the deployer wallet (should delete the key after use, do NOT commit the private key to GitHub):

```javascript
    ...
    theta_mainnet: {
      url: `https://eth-rpc-api.thetatoken.org/rpc`,
      accounts: ["1111111111111111111111111111111111111111111111111111111111111111"],
      chainId: 361,
      gasPrice: 4000000000000
    },
    ...
```

Next, go to the repository's root folder and run this to deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network theta_mainnet
```

# Special Notes on Ethers.js

Note: Ethers.js seems to compute the deployment address of a smart contract via the following formula, instead of reading it from the ETH RPC response:

```python
contract_addr = sha3(rlp.encode([deployer_address, nonce]))[12:]
```

Note that Theta's account sequence starts from 1, while Ethereum's account sequence (i.e. nonce) starts from 0. Due to this "off-by-one" discrepancy, the token address calculated by ethers.js does not match with the deployed contract. A **work-around is to deploy each contract twice**. Since the sequence/nonce increments by 1 each time, the second deployment will deploy the contract to the address calcualted by ethers.js. The following pseudo code illustrates the work-around:

```javascript
token = await Token.Deploy()
tokenAddr = token.address       // tokenAddr is calculated by ethers.js with an "off-by-one" nonce
okenCopy = await Token.Deploy() // tokenCopy is deployed to tokenAddr
```

Please see [here](https://github.com/thetatoken/theta-hardhat-demo/blob/e352fbd2785edbf912e51894e8e63f977f0c018c/test/Token.js#L62) for more details.
