const fs = require('fs');
const path = require('path');


module.exports = {

   async create(pathNetworks){
      //Variáveis chaincode
      const templateChaincodeArchive = path.join(process.cwd(), '/template/chaincode');
      const chaincodeIndexFile = path.resolve(__dirname, templateChaincodeArchive, 'index.js');
      const chaincodePackageFile = path.resolve(__dirname, templateChaincodeArchive, 'package.json');
      const chaincodeStartFile = path.resolve(__dirname, templateChaincodeArchive, 'startFabric.sh');
      // Js dentro do chaincode
      const templateChaincodeJsArchive = path.join(process.cwd(), '/template/chaincode/javascript');
      const chaincodeJSEnrollAdminFile = path.resolve(__dirname, templateChaincodeJsArchive, 'enrollAdmin.js');
      const chaincodeJSInvokeFile = path.resolve(__dirname, templateChaincodeJsArchive, 'invoke.js');
      const chaincodeJSQueryFile = path.resolve(__dirname, templateChaincodeJsArchive, 'query.js');
      const chaincodeJSRegisterUserFile = path.resolve(__dirname, templateChaincodeJsArchive, 'registerUser.js');
      const chaincodeJSPackageFile = path.resolve(__dirname, templateChaincodeJsArchive, 'package.json');
      // Lib dentro do chaincode
      const templateChaincodeLibArchive = path.join(process.cwd(), '/template/chaincode/lib');
      const chaincodeLibFastennetworkFile = path.resolve(__dirname, templateChaincodeLibArchive, 'fastenetwork.js');

      fs.copyFileSync(chaincodeIndexFile, pathNetworks+"/chaincode/index.js");
      fs.copyFileSync(chaincodePackageFile, pathNetworks+"/chaincode/package.json");
      fs.copyFileSync(chaincodeStartFile, pathNetworks+"/chaincode/startFabric.sh");

      fs.copyFileSync(chaincodeJSEnrollAdminFile, pathNetworks+"/chaincode/javascript/enrollAdmin.js");
      fs.copyFileSync(chaincodeJSInvokeFile, pathNetworks+"/chaincode/javascript/invoke.js");
      fs.copyFileSync(chaincodeJSPackageFile, pathNetworks+"/chaincode/javascript/package.json");
      fs.copyFileSync(chaincodeJSQueryFile, pathNetworks+"/chaincode/javascript/query.js");
      fs.copyFileSync(chaincodeJSRegisterUserFile, pathNetworks+"/chaincode/javascript/registerUser.js");

      fs.copyFileSync(chaincodeLibFastennetworkFile, pathNetworks+"/chaincode/lib/fastenetwork.js");
   }

}