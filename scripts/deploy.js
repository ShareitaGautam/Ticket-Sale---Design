const Web3 = require('web3');
const { abi, evm } = require('./TicketSale.json'); // ABI and Bytecode of your contract
require('dotenv').config();

// Connect to Sepolia via Infura
const web3 = new Web3(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

// Get your account and create contract instance
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Deploy the contract
const deploy = async () => {
    const ticketSaleContract = new web3.eth.Contract(abi);

    // Estimate gas and deploy
    const deployTx = ticketSaleContract.deploy({
        data: evm.bytecode.object,
        arguments: [web3.utils.toWei('0.1', 'ether')] // Example ticket price
    });

    const gas = await deployTx.estimateGas();
    const deployedContract = await deployTx.send({
        from: web3.eth.defaultAccount,
        gas,
        gasPrice: web3.utils.toWei('10', 'gwei')
    });

    console.log('Contract deployed at address:', deployedContract.options.address);
};

deploy().catch(console.error);
