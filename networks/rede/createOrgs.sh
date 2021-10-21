function createOrgs() {
   # Remove as pastas se existirem
   if [ -d "organizations/peerOrganizations" ]; then
      rm -Rf organizations/peerOrganizations && rm -Rf organizations/ordererOrganizations
   fi

   if [ "$CRYPTO" == "cryptogen" ]; then
      which cryptogen
      if [ "$?" -ne 0 ]; then
         fatalln "cryptogen tool not found. exiting"
      fi
      infoln "Generating certificates using cryptogen tool"
      infoln "Creating org1 Identities"
      set -x
      cryptogen generate --config=./organizations/cryptogen/crypto-config-org1.yaml --output="organizations"
      res=$?
      { set +x; } 2>/dev/null
      if [ $res -ne 0 ]; then
         fatalln "Failed to generate certificates..."
      fi
      
      set -x
      cryptogen generate --config=./organizations/cryptogen/crypto-config-orderer.yaml --output="organizations"
      res=$?
      { set +x; } 2>/dev/null
      if [ $res -ne 0 ]; then
         fatalln "Failed to generate certificates..."
      fi
      fi

   # Create crypto material using Fabric CA
   if [ "$CRYPTO" == "Certificate Authorities" ]; then
      infoln "Generating certificates using Fabric CA"

      IMAGE_TAG=${CA_IMAGETAG} docker-compose -f $COMPOSE_FILE_CA up -d 2>&1

      . organizations/fabric-ca/registerEnroll.sh

      while :
         do
            if [ ! -f "organizations/fabric-ca/org1/tls-cert.pem" ]; then
            sleep 1
            else
            break
            fi
         done

      infoln "Creating Org1 Identities"
      createOrg1



      infoln "Creating Orderer Identities"
      createOrderer




   fi

  infoln "Generating CCP files for Org1 and Org2"
  ./organizations/ccp-generate.sh
}