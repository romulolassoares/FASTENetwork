/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FasteNetwork extends Contract {
    
    async initLedger(ctx){
        await ctx.stub.putState("Init", "Fasten Network Project");
        return "success";
    }

    async writeData(ctx, key, value){
        await ctx.stub.putState(key, value);
        return value;
    }

    async readData(ctx, key){
        var response = await ctx.stub.getState(key);
        return response.toString();
    }

    async createTransaction(ctx, transactionID, userPki, iotPki, task, timestamp) {
        console.info('============= START : Create Transaction ===========');

        const transaction = {
            docType: 'transaction',
            userPki,
            iotPki,
            task,
            timestamp,
        };

        var response = await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(transaction)));
        console.info('============= END : Create Transaction ===========');
        console.info(response);
    }


    async queryTransaction(ctx, transactionID) {
        const transactionAsBytes = await ctx.stub.getState(transactionID);
        if (!transactionAsBytes || transactionAsBytes.length === 0) {
            throw new Error(`${transactionID} does not exist`);
        }
        console.log(transactionAsBytes.toString());
        return transactionAsBytes.toString();
    }

}

module.exports = FasteNetwork;