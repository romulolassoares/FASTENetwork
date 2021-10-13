const fs = require('fs');
const fsex = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const readline = require('readline');
const crypto = require('crypto');

const extra = require('./extra');
const { text } = require('express');


module.exports = {
   async createSh(req) {

      const {nomeRede, descricaoRede, nomeOrg, numPeer, nomeCanal} = req.body;
      const networks = path.join(process.cwd(), 'networks');
      const pathNetworks = networks + '/' + nomeRede;

      var portPeer = 7051;

      //Variáveis dos arquivos de scripts
      const templateScripts = path.join(process.cwd(), '/template/scripts');
      const configUpdateSh = path.resolve(__dirname, templateScripts, 'configUpdate.sh');
      //const createChannelSh = path.resolve(__dirname, templateScripts, 'createChannel.sh');
      const deployCCSh = path.resolve(__dirname, templateScripts, 'deployCC.sh');
      const setAnchorPeersSh = path.resolve(__dirname, templateScripts, 'setAnchorPeer.sh');
      const utilsSh = path.resolve(__dirname, templateScripts, 'utils.sh');

      const envVar = path.resolve(__dirname, templateScripts, 'envVar.sh');

      const templateCreateChannel = path.join(process.cwd(), '/template/scripts/createChannel');
      const createChannelSh = path.resolve(__dirname, templateCreateChannel, 'createChannel.sh');
      const createChannelJoinChannelSh = path.resolve(__dirname, templateCreateChannel, 'createChannel-joinChannel.sh');
      const createChannelSetAnchorPeerSh = path.resolve(__dirname, templateCreateChannel, 'createChannel-setAnchorPeer.sh');
      const createChannelChamadasSh = path.resolve(__dirname, templateCreateChannel, 'createChannel-chamadas.sh');
      const createChannelChamadasJoinChannelSh = path.resolve(__dirname, templateCreateChannel, 'createChannel-chamadas-joinChannel.sh');
      const createChannelChamadasSetAnchorPeerSh = path.resolve(__dirname, templateCreateChannel, 'createChannel-chamadas-setAnchorPeer.sh');
      const createChannelChamadasEndSh = path.resolve(__dirname, templateCreateChannel, 'createChannel-chamadas-end.sh');

      const templateCreateOrgs = path.join(process.cwd(), '/template/createOrgs');
      const createOrgsFile = path.resolve(__dirname, templateCreateOrgs, 'createOrgs.sh');
      const createOrgsOrdererFile = path.resolve(__dirname, templateCreateOrgs, 'createOrgs-orderer.sh');
      const creareOrgsCryptoOgsFile = path.resolve(__dirname, templateCreateOrgs, 'createOrgs-cryptoOrgs.sh');
      const creareOrgsCAFile = path.resolve(__dirname, templateCreateOrgs, 'createOrgs-ca.sh');
      const creareOrgsCACreateOrgFile = path.resolve(__dirname, templateCreateOrgs, 'createOrgs-ca-createOrgs.sh');
      const creareOrgsCACCPFile = path.resolve(__dirname, templateCreateOrgs, 'createOrgs-ca-ccp.sh');

      const templateDeployCC = path.join(process.cwd(), '/template/scripts/deployCC');
      const deployCCFile = path.resolve(__dirname, templateDeployCC, 'deployCC.sh');
      const deployCCInstallChaincodeFile = path.resolve(__dirname, templateDeployCC, 'deployCC_installChaincode.sh');
      const deployCCQueryApproveFile = path.resolve(__dirname, templateDeployCC, 'deployCC_queryApprove.sh');
      const deployCCCheckCommitFile = path.resolve(__dirname, templateDeployCC, 'deployCC_checkCommit.sh');
      const deployCCCheckCommitLineFile = path.resolve(__dirname, templateDeployCC, 'deployCC_checkCommit_line.sh');
      const deployCCApproveOrgFile = path.resolve(__dirname, templateDeployCC, 'deployCC_approveOrg.sh');
      const deployCCCheckCommitTTFile = path.resolve(__dirname, templateDeployCC, 'deployCC_checkCommitTT.sh');
      const deployCCCheckCommitTTLineFile = path.resolve(__dirname, templateDeployCC, 'deployCC_checkCommitTT_line.sh');
      const deployCCCommitChaincodeFile = path.resolve(__dirname, templateDeployCC, 'deployCC_commitChaincode.sh');
      const deployCCQueryCommitedFile = path.resolve(__dirname, templateDeployCC, 'deployCC_queryCommited.sh');
      const deployCCEndFile = path.resolve(__dirname, templateDeployCC, 'deployCC_end.sh');

      const fabricCaServer = path.join(process.cwd(), '/template/orgName');
      const fabricCaServerFile = path.resolve(__dirname, fabricCaServer, 'fabric-ca-server-config.yaml');
      const fabricCaServerAffiliationsFile = path.resolve(__dirname, fabricCaServer, 'fabric-ca-server-config-affiliations.yaml');
      const fabricCaServerEndFile = path.resolve(__dirname, fabricCaServer, 'fabric-ca-server-config-end.yaml');

      const networkShFile = path.join(process.cwd(), '/template/network.sh');
      const verifyShFile = path.join(process.cwd(), '/template/verify.sh');
      const envVarShFile = path.join(process.cwd(), '/template/envVar.sh');
      const fabricCA = path.join(process.cwd(), '/template/fabric-ca');

      const registerEnrollFile = path.join(process.cwd(), '/template/registerEnroll/createOrgname.sh');
      const registerEnrollOrdererFile = path.join(process.cwd(), '/template/registerEnroll/createOrderer.sh');

      const ccpSH = path.join(process.cwd(), '/template/ccp/ccp-generate.sh');
      const ccpJson = path.join(process.cwd(), '/template/ccp/ccp-template.json');
      const ccpYaml = path.join(process.cwd(), '/template/ccp/ccp-template.yaml');

      async function createFolders(){
         //Copia os scripts .sh para as pasta de cada rede
         await fs.copyFileSync(configUpdateSh, pathNetworks+"/scripts/configUpdate.sh");
         await fs.copyFileSync(createChannelSh, pathNetworks+"/scripts/createChannel.sh");
         await fs.copyFileSync(deployCCFile, pathNetworks+"/scripts/deployCC.sh");

         await fs.copyFileSync(envVar, pathNetworks+"/scripts/envVar.sh");

         await fs.copyFileSync(setAnchorPeersSh, pathNetworks+"/scripts/setAnchorPeer.sh");
         await fs.copyFileSync(utilsSh, pathNetworks+"/scripts/utils.sh");

         await fs.copyFileSync(networkShFile, pathNetworks+"/network.sh");
         await fs.copyFileSync(verifyShFile, pathNetworks+"/verify.sh");

         await fs.copyFileSync(createOrgsFile, pathNetworks+"/createOrgs.sh");

         extra.recCopy(fabricCA, pathNetworks+"/organizations/fabric-ca");

         await fs.copyFileSync(ccpSH, pathNetworks+"/organizations/ccp-generate.sh");
         await fs.copyFileSync(ccpYaml, pathNetworks+"/organizations/ccp-template.yaml");
         await fs.copyFileSync(ccpJson, pathNetworks+"/organizations/ccp-template.json");

         await fs.copyFileSync(registerEnrollFile, pathNetworks+"/organizations/fabric-ca/registerEnroll.sh")
      };


      async function createCreateOrgsFiles(){
         const createOrgs = path.join(pathNetworks, '/createOrgs.sh');
         for (let i = 0; i < nomeOrg.length; i++) {
            await extra.appendWriting(creareOrgsCryptoOgsFile, createOrgs, 'orgname', nomeOrg[i].toLowerCase());
         }
         await extra.appendWriting(createOrgsOrdererFile, createOrgs);
         await extra.appendWriting(creareOrgsCAFile, createOrgs);
         for (let i = 0; i < nomeOrg.length; i++) {
            await extra.appendWriting(creareOrgsCACreateOrgFile, createOrgs, 'Orgname', nomeOrg[i]);
         }
         await extra.appendWriting(creareOrgsCACreateOrgFile, createOrgs, 'Orgname', "Orderer");
         await extra.appendWriting(creareOrgsCACCPFile, createOrgs);
      }

      async function createCreateChannelFile(){
         const createChannel = path.join(pathNetworks, '/scripts/createChannel.sh');
         portPeer = 7051
         await extra.changeWriting(createChannel, 'Orgname', nomeOrg[0]);
         await extra.changeWriting(createChannel, 'orgname', nomeOrg[0].toLowerCase());
         await extra.changeWriting(createChannel, 'peernumber', 0);
         await extra.changeWriting(createChannel, 'portpeer', portPeer);
         await extra.changeWriting(createChannel, 'networkname', nomeRede);

         await extra.appendWriting(createChannelJoinChannelSh, createChannel);
         await extra.appendWriting(createChannelSetAnchorPeerSh, createChannel);
         await extra.appendWriting(createChannelChamadasSh, createChannel);

         portPeer = 7051
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++) {
               await extra.appendWriting(createChannelChamadasJoinChannelSh, createChannel, 'Orgname', nomeOrg[i]);
               await extra.changeWriting(createChannel, 'orgname', nomeOrg[i].toLowerCase());
               await extra.changeWriting(createChannel, 'peernumber', j);
               await extra.changeWriting(createChannel, 'portpeer', portPeer);
               portPeer+=2000
            }
            
         }
         portPeer = 7051
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++) {
               await extra.appendWriting(createChannelChamadasSetAnchorPeerSh, createChannel, 'Orgname', nomeOrg[i]);
               await extra.changeWriting(createChannel, 'orgname', nomeOrg[i].toLowerCase());
               await extra.changeWriting(createChannel, 'peernumber', j);
               await extra.changeWriting(createChannel, 'portpeer', portPeer);
               portPeer+=2000
            }
            
         }

         await extra.appendWriting(createChannelChamadasEndSh, createChannel);
      }

      async function createDeployCCFiles(){
         const deployCC = path.join(pathNetworks, '/scripts/deployCC.sh');

         portPeer = 7051;
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++) {
               await extra.appendWriting(deployCCInstallChaincodeFile, deployCC, 'orgname', nomeOrg[i].toLowerCase());
               await extra.changeWriting(deployCC, 'Orgname', nomeOrg[i]);
               await extra.changeWriting(deployCC, 'peernumber', j);
               await extra.changeWriting(deployCC, 'portpeer', portPeer);
               portPeer += 2000;
            }
         }

       
         await extra.appendWriting(deployCCQueryApproveFile, deployCC, 'orgname', nomeOrg[0].toLowerCase());
         await extra.changeWriting(deployCC, 'Orgname', nomeOrg[0]);
         await extra.changeWriting(deployCC, 'peernumber', 0);
         await extra.changeWriting(deployCC, 'portpeer', 7051);
    
         portPeer = 7051;
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++) {
               if ( j == 0 ) {
                  if ( i == 0 && j == 0) {
                     await extra.appendWriting(deployCCCheckCommitFile, deployCC, 'orgname', nomeOrg[i].toLowerCase());
                     await extra.changeWriting(deployCC, 'Orgname', nomeOrg[i]);
                     await extra.changeWriting(deployCC, 'peernumber', j);
                     await extra.changeWriting(deployCC, 'portpeer', portPeer);
                  } else {
                     await extra.appendWriting(deployCCCheckCommitLineFile, deployCC, 'orgname', nomeOrg[i].toLowerCase());
                     await extra.changeWriting(deployCC, 'Orgname', nomeOrg[i]);
                     await extra.changeWriting(deployCC, 'peernumber', j);
                     await extra.changeWriting(deployCC, 'portpeer', portPeer);
                  }
                  
               }
               portPeer += 2000;
            }
         }

         portPeer = 7051
         portPeer += 2000 * parseInt(numPeer[0]);
         for (let i = 1; i < nomeOrg.length; i++) {

            await extra.appendWriting(deployCCApproveOrgFile, deployCC, 'orgname', nomeOrg[i].toLowerCase());
            await extra.changeWriting(deployCC, 'Orgname', nomeOrg[i]);
            await extra.changeWriting(deployCC, 'peernumber', 0);
            await extra.changeWriting(deployCC, 'portpeer', portPeer);

            let portPeer2 = 7051;
            for (let j = 0; j < nomeOrg.length; j++) {
               for (let k = 0; k < numPeer[j]; k++) {
                  if (k == 0) {
                        if ( j == 0) {
                        await extra.appendWriting(deployCCCheckCommitTTFile, deployCC, 'orgname', nomeOrg[j].toLowerCase());
                        await extra.changeWriting(deployCC, 'Orgname', nomeOrg[j]);
                        await extra.changeWriting(deployCC, 'peernumber', 0);
                        await extra.changeWriting(deployCC, 'portpeer', portPeer2);
                     } else {
                        await extra.appendWriting(deployCCCheckCommitTTLineFile, deployCC, 'orgname', nomeOrg[j].toLowerCase());
                        await extra.changeWriting(deployCC, 'Orgname', nomeOrg[j]);
                        await extra.changeWriting(deployCC, 'peernumber', 0);
                        await extra.changeWriting(deployCC, 'portpeer', portPeer2);
                     }
                  }
                  portPeer2 += 2000
               }
            }

            portPeer += 2000 * parseInt(numPeer[i]) ;

         }

         portPeer = 7051;
         let text = "";
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++) {
                  text += nomeOrg[i] + " ";
                  text += nomeOrg[i].toLowerCase() + " ";
                  text += "peer" + j + " ";
                  text += portPeer + " ";
               portPeer += 2000;
            }
         }

         await extra.appendWriting(deployCCCommitChaincodeFile, deployCC, 'text', text);
         
         portPeer = 7051;
         for (let i = 0; i < nomeOrg.length; i++) {
            for (let j = 0; j < numPeer[i]; j++) {
               if ( j == 0 ) {
                  await extra.appendWriting(deployCCQueryCommitedFile, deployCC, 'orgname', nomeOrg[i].toLowerCase());
                  await extra.changeWriting(deployCC, 'Orgname', nomeOrg[i]);
                  await extra.changeWriting(deployCC, 'peernumber', j);
                  await extra.changeWriting(deployCC, 'portpeer', portPeer);
               }
               portPeer += 2000;
            }
         }

         await extra.appendWriting(deployCCEndFile, deployCC, 'text', text);
         
      }


      async function createRegisterEnroll(){
         const registerEnroll = path.join(pathNetworks, '/organizations/fabric-ca/registerEnroll.sh');
         var portCA = 7054;
         await extra.changeWriting(registerEnroll, 'Orgname', nomeOrg[0]);
         await extra.changeWriting(registerEnroll, 'orgname', nomeOrg[0].toLowerCase());
         await extra.changeWriting(registerEnroll, 'portca', portCA);
         await extra.changeWriting(registerEnroll, 'numpeer', numPeer[0]-1);
         portCA += 1000;
         for (let i = 1; i < nomeOrg.length; i++) {
            await extra.appendWriting(registerEnrollFile, registerEnroll, 'orgname', nomeOrg[i].toLowerCase());
            await extra.changeWriting(registerEnroll, 'Orgname', nomeOrg[i]);
            await extra.changeWriting(registerEnroll, 'portca', portCA);
            await extra.changeWriting(registerEnroll, 'numpeer', numPeer[i]-1);
            portCA += 1000;
         }
         await extra.appendWriting(registerEnrollOrdererFile, registerEnroll, 'portca', portCA);
      }

      async function createFabricCaServer() {
         for (let i = 0; i < nomeOrg.length; i++) {
            await fs.mkdirSync(pathNetworks + '/organizations/fabric-ca/' + nomeOrg[i].toLowerCase());
            await fs.copyFileSync(fabricCaServerFile, pathNetworks + '/organizations/fabric-ca/' + nomeOrg[i].toLowerCase() + '/fabric-ca-server-config.yaml');

            const fabricCaServerPath = path.join(pathNetworks, '/organizations/fabric-ca/' + nomeOrg[i].toLowerCase() + '/fabric-ca-server-config.yaml');
            await extra.changeWriting(fabricCaServerPath, 'Orgname', nomeOrg[i]);
            for (let i = 0; i < nomeOrg.length; i++) {
               await extra.appendWriting(fabricCaServerAffiliationsFile, fabricCaServerPath, 'orgname', nomeOrg[i].toLowerCase());
            }
            await extra.appendWriting(fabricCaServerEndFile, fabricCaServerPath, 'orgname', nomeOrg[i].toLowerCase());
         }

 
      }

      await createFolders();

      const networkSh = path.join(pathNetworks, '/network.sh');
      await extra.changeWriting(networkSh, 'channelName', nomeCanal);
      var total = 0;
      for (let j = 0; j < numPeer.length; j++) {
         total = total + parseInt(numPeer[j]);
      }
      
      await extra.changeWriting(pathNetworks+"/scripts/envVar.sh", 'total', total);

      await createCreateOrgsFiles();
      await createCreateChannelFile();
      await createDeployCCFiles();
      await createRegisterEnroll();
      await createFabricCaServer();
      // await createEnvVar();

   }
}