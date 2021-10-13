const fs = require('fs');
const fsex = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const readline = require('readline');
const crypto = require('crypto');

const extra = require('./extra');
const creatShFiles = require('./createShFiles');
const validacao = require('./validacao');
const createChaincode = require('./createChaincodeFiles');

module.exports = {
   async creatAndSave(req,res) {
      const {nomeRede, descricaoRede, nomeOrg, numPeer, nomeCanal} = req.body;

      const networks = path.join(process.cwd(), 'networks');
      const pathNetworks = networks + '/' + nomeRede;
      const bin = networks + '/bin/';

      //Alterações de segurança para a rede funcionar
      await validacao.validaNomeOrg(nomeOrg);
      await validacao.validaNomeCanal(nomeCanal);

      //Variáveis das portas
      var portPeer = 7051;
      var portPeer2 = 7052;
      var portCa = 7054;
      var portCouchDB = 5984;
      var couchdbNumber = 0;

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
      
      //Variáveis docker-compose
      const templateDockerComposeArchive = path.join(process.cwd(), '/template/docker');
      //Variáveis docker-compose-ca
      const templateDockerComposeCA = path.join(templateDockerComposeArchive, '/docker-compose-ca');
      const dockerComposeCaFile = path.resolve(__dirname, templateDockerComposeCA, 'docker-compose-ca.yaml');
      const dockerComposeCaOrgsFile = path.resolve(__dirname, templateDockerComposeCA, 'docker-compose-ca-orgs.yaml');
      const dockerComposeCaOrdererFile = path.resolve(__dirname, templateDockerComposeCA, 'docker-compose-ca-orderer.yaml');
      //Variáveis docker-compose-couch
      const templateDockerComposeCouch = path.join(templateDockerComposeArchive, '/docker-compose-couch');
      const dockerComposeCouchFile = path.resolve(__dirname, templateDockerComposeCouch, 'docker-compose-couch.yaml');
      const dockerComposeCouchDBFile = path.resolve(__dirname, templateDockerComposeCouch, 'docker-compose-couch-db.yaml');
      const dockerComposeCouchPeerorgsFile = path.resolve(__dirname, templateDockerComposeCouch, 'docker-compose-couch-peerorgs.yaml');
      //Variáveis docker-compose-test-net
      const templateDockerCompose = path.join(templateDockerComposeArchive, '/docker-compose-test-net');
      const dockerComposeFile = path.resolve(__dirname, templateDockerCompose, 'docker-compose-test-net.yaml');
      const dockerComposeVolumesPeerOrgsFile = path.resolve(__dirname, templateDockerCompose, 'docker-compose-test-net-volumes-peerorgs.yaml');
      const dockerComposeNetworkFile = path.resolve(__dirname, templateDockerCompose, 'docker-compose-test-net-networks.yaml');
      const dockerComposeOrdererFile = path.resolve(__dirname, templateDockerCompose, 'docker-compose-test-net-orderer.yaml');
      const dockerComposePeerOrgsFile = path.resolve(__dirname, templateDockerCompose, 'docker-compose-test-net-peerorgs.yaml');
      const dockerComposeCliFile = path.resolve(__dirname, templateDockerCompose, 'docker-compose-test-net-cli.yaml');
      const dockerComposeCliPeerOrgsFile = path.resolve(__dirname, templateDockerCompose, 'docker-compose-test-net-cli-peerorgs.yaml');
      const dockerComposeCliNetworksFile = path.resolve(__dirname, templateDockerCompose, 'docker-compose-test-net-cli-networks.yaml');

      //Variáveis crypto-config
      const templateCyptoConfig = path.join(process.cwd(), '/template/cryptogen');
      const cryptoConfigOrderer = path.resolve(__dirname, templateCyptoConfig, 'crypto-config-orderer.yaml');
      const cryptoConfigOrgname = path.resolve(__dirname, templateCyptoConfig, 'crypto-config-orgname.yaml');

      //Variáveis configtx
      const templateConfigtx = path.join(process.cwd(), '/template/configtx');
      const configtxFile = path.resolve(__dirname, templateConfigtx, 'configtx.yaml');
      const configtxOrgsFile = path.resolve(__dirname, templateConfigtx, 'configtx-orgs.yaml');
      const configtxCapabilitiesFile = path.resolve(__dirname, templateConfigtx, 'configtx-capabilities.yaml');
      const configtxApplicationFile = path.resolve(__dirname, templateConfigtx, 'configtx-application.yaml');
      const configtxOrdererFile = path.resolve(__dirname, templateConfigtx, 'configtx-orderer.yaml');
      const configtxChannelFile = path.resolve(__dirname, templateConfigtx, 'configtx-channel.yaml');
      const configtxProfileFile = path.resolve(__dirname, templateConfigtx, 'configtx-profile.yaml');
      const configtxtwoOrgsOrderergenesisFile = path.resolve(__dirname, templateConfigtx, 'configtx-profile-twoOrgsOrdererGenesis-orgs.yaml');
      const configtxTwoOrgsChannelFile = path.resolve(__dirname, templateConfigtx, 'configtx-profile-twoOrgChannel.yaml');
      const configtxTwoOrgsChannelOrgsFile = path.resolve(__dirname, templateConfigtx, 'configtx-profile-twoOrgChannel-orgs.yaml');
      const configtxEndFile = path.resolve(__dirname, templateConfigtx, 'configtx-profile-end.yaml');

      
      //Cria as pastas e arquivos da networ{}
      async function createFolders(){
         if(fs.existsSync(networks)) {//Se existir a pasta networks
            //Cria a pasta com o nome da rede
            fs.mkdirSync(pathNetworks.trim());
         } else {//Se não existir a pasta networks
            //Cria a pasta networks
            fs.mkdirSync(networks.trim());
            //Cria a pasta bin, sem os binarios do Hyperledger Fabric
            fs.mkdirSync(networks + '/bin');
            //Cria a pasta com o nome da rede
            fs.mkdirSync(pathNetworks.trim());
         }
         //Cria as pasta
         //await fs.copyFileSync('/home/romulo/www/FASTENTemp/template/.env', pathNetworks+'/.env');
         //Arquivos do chaincode
         //Pastas
         await fs.mkdirSync(pathNetworks+"/chaincode");
         await fs.mkdirSync(pathNetworks+"/chaincode/javascript");
         await fs.mkdirSync(pathNetworks+"/chaincode/lib");
         // await extra.copyFiles(process.cwd()+"/template/chaincode", pathNetworks+"/chaincode" )
         createChaincode.create(pathNetworks);
         

         //Arquivos de configuração da red
         //Pastas
         await fs.mkdirSync(pathNetworks+"/configtx");
         await fs.mkdirSync(pathNetworks+"/docker");
         await fs.mkdirSync(pathNetworks+"/organizations");
         await fs.mkdirSync(pathNetworks+"/organizations/cryptogen");
         await fs.mkdirSync(pathNetworks+"/scripts");
         await fs.mkdirSync(pathNetworks+"/system-genesis-block");
         //Arquivos .yaml
         await fs.copyFileSync(dockerComposeCaFile, pathNetworks+"/docker/docker-compose-ca.yaml");
         await fs.copyFileSync(dockerComposeCouchFile, pathNetworks+"/docker/docker-compose-couch.yaml");
         await fs.copyFileSync(dockerComposeFile, pathNetworks+"/docker/docker-compose-test-net.yaml");
         await fs.copyFileSync(cryptoConfigOrderer, pathNetworks+"/organizations/cryptogen/crypto-config-orderer.yaml");
         for (let i = 0; i < nomeOrg.length; i++) {
            await fs.copyFileSync(cryptoConfigOrgname, pathNetworks+"/organizations/cryptogen/crypto-config-" + nomeOrg[i].toLowerCase() + ".yaml");
         }
         await fs.copyFileSync(configtxFile, pathNetworks+"/configtx/configtx.yaml");
      };

      async function createDockerComposeCa(){
         const dockerComposeCa = path.join(pathNetworks, '/docker/docker-compose-ca.yaml');
         for (let i = 0; i < nomeOrg.length; i++) {
            await extra.appendWriting(dockerComposeCaOrgsFile, dockerComposeCa, 'orgname', nomeOrg[i].toLowerCase());
            await extra.changeWriting(dockerComposeCa, 'portca', portCa);
            portCa += 1000;
         }
         await extra.appendWriting(dockerComposeCaOrdererFile, dockerComposeCa);
         await extra.changeWriting(dockerComposeCa, 'portca', portCa);
         //Alterações gerais
         await extra.changeWriting(dockerComposeCa, 'networkname', nomeRede);
      }

      async function createDockerComposeCouch(){
         const dockerComposeCouch = path.join(pathNetworks, '/docker/docker-compose-couch.yaml');
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++){
               await extra.appendWriting(dockerComposeCouchDBFile, dockerComposeCouch, 'couchdbnumber', couchdbNumber);
               await extra.changeWriting(dockerComposeCouch, 'portcouchdb', portCouchDB);
               portCouchDB += 2000;
               await extra.appendWriting(dockerComposeCouchPeerorgsFile, dockerComposeCouch, 'orgname', nomeOrg[i].toLowerCase());
               await extra.changeWriting(dockerComposeCouch, 'peernumber', j);
               await extra.changeWriting(dockerComposeCouch, 'couchdbnumber',couchdbNumber);
               couchdbNumber++;
            }
         }
         //Alterações gerais
         await extra.changeWriting(dockerComposeCouch, 'networkname', nomeRede);
      }

      async function createDockerCompose(){
         const dockerCompose = path.join(pathNetworks, '/docker/docker-compose-test-net.yaml');
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++){
               await extra.appendWriting(dockerComposeVolumesPeerOrgsFile, dockerCompose, 'orgname', nomeOrg[i].toLowerCase());
               await extra.changeWriting(dockerCompose, 'peernumber', j);
            }
         }
         await extra.appendWriting(dockerComposeNetworkFile, dockerCompose);
         await extra.appendWriting(dockerComposeOrdererFile, dockerCompose);
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++){
               await extra.appendWriting(dockerComposePeerOrgsFile, dockerCompose, 'orgname', nomeOrg[i].toLowerCase());
               await extra.changeWriting(dockerCompose, 'Orgname', nomeOrg[i]);
               await extra.changeWriting(dockerCompose, 'peernumber', j);
               await extra.changeWriting(dockerCompose, 'portpeer2', portPeer2);
               await extra.changeWriting(dockerCompose, 'portpeer', portPeer);
               portPeer += 2000;
               portPeer2 += 2000;
            }
         }
         await extra.appendWriting(dockerComposeCliFile, dockerCompose);
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++){
               await extra.appendWriting(dockerComposeCliPeerOrgsFile, dockerCompose, 'orgname', nomeOrg[i].toLowerCase());
               await extra.changeWriting(dockerCompose, 'peernumber', j);
            }
         }
         await extra.appendWriting(dockerComposeCliNetworksFile, dockerCompose);
         await extra.changeWriting(dockerCompose, 'networkname', nomeRede);
      }

      async function createCryptoConfig(){
         for (let i = 0; i < nomeOrg.length; i++) {
            let cryptoConfigOrgname = path.join(pathNetworks, '/organizations/cryptogen/crypto-config-' + nomeOrg[i].toLowerCase() + '.yaml');
            await extra.changeWriting(cryptoConfigOrgname, 'Orgname', nomeOrg[i]);
            await extra.changeWriting(cryptoConfigOrgname, 'orgname', nomeOrg[i].toLowerCase());
            await extra.changeWriting(cryptoConfigOrgname, 'numpeer', numPeer[i]);
         }
      }

      async function createConfigtx(){
         const configtx = path.join(pathNetworks, '/configtx/configtx.yaml');
         for (let i = 0; i < nomeOrg.length; i++) {
               await extra.appendWriting(configtxOrgsFile, configtx, 'Orgname', nomeOrg[i]);
               await extra.changeWriting(configtx, 'orgname', nomeOrg[i].toLowerCase());
         }
         await extra.appendWriting(configtxCapabilitiesFile, configtx);
         await extra.appendWriting(configtxApplicationFile, configtx);
         await extra.appendWriting(configtxOrdererFile, configtx);
         await extra.appendWriting(configtxChannelFile, configtx);
         await extra.appendWriting(configtxProfileFile, configtx);
         for (let i = 0; i < nomeOrg.length; i++) {
            await extra.appendWriting(configtxtwoOrgsOrderergenesisFile, configtx, 'Orgname', nomeOrg[i]);
            await extra.changeWriting(configtx, 'orgname', nomeOrg[i].toLowerCase());
         }
         await extra.appendWriting(configtxTwoOrgsChannelFile, configtx);
         for (let i = 0; i < nomeOrg.length; i++) {
            await extra.appendWriting(configtxTwoOrgsChannelOrgsFile, configtx, 'Orgname', nomeOrg[i]);
            await extra.changeWriting(configtx, 'orgname', nomeOrg[i].toLowerCase());
         }
         await extra.appendWriting(configtxEndFile, configtx);
      }
      
      await fs.stat(pathNetworks, async function(err, stats){
         if(err) {// se a rede ainda não exites
            await createFolders();
            await createDockerComposeCa();
            await createDockerComposeCouch();
            await createDockerCompose();

            await createCryptoConfig();

            await createConfigtx();
            creatShFiles.createSh(req);
         }
         else{ // Se a rede existir
           console.log('Essa networks já existe');
         }
       })
       
   },

   verifyNetworkName(req,res){
         const networks = path.join(process.cwd(), 'network');
         const pathNetworks = networks + '/' + req.body.nomeRede;
         if (fs.existsSync(pathNetworks)) {
            return "exist";
         }
         return "notExist";
   },

   async startNetwork(rededatabase){
      
      const networks = path.join(process.cwd(), 'networks');
      const pathNetworks = networks + '/' + rededatabase.nomeRede;

      shell.cd(pathNetworks);
      shell.exec('./network.sh up createChannel -ca -s couchdb');
      shell.cd('../..');
      
  },

  async stopNetwork(rededatabase){
      const networks = path.join(process.cwd(), 'networks');
      const pathNetworks = networks + '/' + rededatabase.nomeRede;


      
      shell.cd(pathNetworks);
      shell.exec('./network.sh down');
      shell.cd('../..');

  },

  async createChannel(rededatabase){
      
   const networks = path.join(process.cwd(), 'networks');
   const pathNetworks = networks + '/' + rededatabase.nomeRede;

   shell.cd(pathNetworks);
   shell.exec('./network.sh createChannel -ca -s couchdb');
   shell.cd('../..');
   
},

async deployCC(rededatabase){
      
   const networks = path.join(process.cwd(), 'networks');
   const pathNetworks = networks + '/' + rededatabase.nomeRede;
   
   const chaincode = path.resolve(process.cwd(), networks, rededatabase.nomeRede + '/chaincode');

   shell.cd(pathNetworks);
   shell.exec('./network.sh deployCC -ccn fastenetwork -ccv 1 -cci initLedger -ccl javascript -ccp ' + chaincode);
   shell.cd('../..');
}


}
