# Theta Hardhat Demo

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

```sh
export SEQ=`thetacli query account --address=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab | grep sequence | grep -o '[[:digit:]]\+'`

thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A --tfuel=1000 --password=qwertyuiop --seq=$(($SEQ+1))

thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x1563915e194D8CfBA1943570603F7606A3115508 --tfuel=1000 --password=qwertyuiop --seq=$(($SEQ+2))
```

## Deploy the contract to the local privatenet

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
