/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FasteNetwork extends Contract {
/*
- Impressora:
    id: printer3d1,
  	type: printer3d,
	timestamp: int
    file_name: Text
    printer3d_state: Text
*/
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

    async createPrinter(ctx, printerID, type, timestamp, file_name, printer3d_state) {
        console.info('============= START : Create Printer ===========');

        const printer = {
            docType: 'printer',
            type,
            timestamp,
            file_name,
            printer3d_state,
        };

        var response = await ctx.stub.putState(printerID, Buffer.from(JSON.stringify(printer)));
        console.info('============= END : Create Printer ===========');
        console.info(response);
    }


    async queryPrinter(ctx, printerID) {
        const printerAsBytes = await ctx.stub.getState(printerID);
        if (!printerAsBytes || printerAsBytes.length === 0) {
            throw new Error(`${printerID} does not exist`);
        }
        console.log(printerAsBytes.toString());
        return printerAsBytes.toString();
    }

}

module.exports = FasteNetwork;
