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
