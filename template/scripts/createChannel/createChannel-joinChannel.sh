# joinChannel ORG
joinChannel() {
  FABRIC_CFG_PATH=$PWD/../config/
  ORG_NAME=$1
  org_NAME=$2
  PEER_NUMBER=$3
  PORT_PEER=$4

  setGlobals $ORG_NAME $org_NAME $PEER_NUMBER $PORT_PEER
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, ${PEER_NUMBER}.org${ORG} has failed to join channel '$CHANNEL_NAME' "
}
