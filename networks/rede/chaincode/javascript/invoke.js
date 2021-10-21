/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

module.exports = {
    async savePrinter(user, printer) {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'app/controller/wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(user);
            if (!identity) {
                console.log(`An identity for the user "${user}" does not exist in the wallet`);
                return false;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('fastenetwork');

            // Submit the specified transaction.
            await contract.submitTransaction("createPrinter", printer.printerID, printer.type, printer.timestamp, printer.file_name, printer.printer3d_state);
            console.log('Transaction has been submitted');

            // Disconnect from the gateway.
            await gateway.disconnect();

            return true;

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            return false;
        }
    }

}