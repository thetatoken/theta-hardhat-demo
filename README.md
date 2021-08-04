# Hardhat Hackathon Boilerplate

This repository contains a sample project that you can use as the starting point
for your Theta DApp project development with the Hardhat suite.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/thetatoken/theta-hardhat-demo
cd theta-hardhat-demo
npm install
```

## Setup Theta local privatenet

Once installed, let's setup the Theta local privatenet with the Theta/Ethereum RPC Adaptor [following this guide](https://docs.thetatoken.org/docs/setup-local-theta-ethereum-rpc-adaptor). The ETH RPC adaptor running at `http://localhost:18888/rpc` interacts with the Web3.js library by translating the Theta RPC interface into the ETH RPC interface.


## Fund the test accounts with some TFuel

Execute the two commands below to fun the test accounts with some TFuel:

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network theta_privatenet
```

## Run the unit tests against the local privatenet

```sh
npx hardhat test --network theta_privatenet
```

# Run the frontend

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```
