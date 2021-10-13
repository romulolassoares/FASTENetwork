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
