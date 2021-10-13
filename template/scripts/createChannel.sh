#!/bin/bash

# imports  
. scripts/envVar.sh
. scripts/utils.sh

CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

createChannelTx() {
	set -x
	configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
	res=$?
	{ set +x; } 2>/dev/null
  verifyResult $res "Failed to generate channel configuration transaction..."
}

createChannel() {
	setGlobals Org1 org1 peer0 7051
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		peer channel create -o localhost:7050 -c $CHANNEL_NAME --ordererTLSHostnameOverride orderer.example.com -f ./channel-artifacts/${CHANNEL_NAME}.tx --outputBlock $BLOCKFILE --tls --cafile $ORDERER_CA >&log.txt
		res=$?
		{ set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"
}

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
	verifyResult $res "After $MAX_RETRY attempts, peer0.org${ORG} has failed to join channel '$CHANNEL_NAME' "
}

setAnchorPeer() {
  ORG_NAME=$1
  org_NAME=$2
  PEER_NUMBER=$3
  PORT_PEER=$4
  docker exec cli ./scripts/setAnchorPeer.sh $ORG_NAME $CHANNEL_NAME $org_NAME $PEER_NUMBER $PORT_PEER
}

FABRIC_CFG_PATH=${PWD}/configtx

## Create channeltx
infoln "Generating channel create transaction '${CHANNEL_NAME}.tx'"
createChannelTx

FABRIC_CFG_PATH=$PWD/../config/
BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

## Create channel
infoln "Creating channel ${CHANNEL_NAME}"
createChannel
successln "Channel '$CHANNEL_NAME' created"

## Join all the peers to the channel
infoln "Joining org1 peer to the channel..."

joinChannel Org1 org1 peer0 7051
joinChannel Org1 org1 peer1 9051
joinChannel Org2 org2 peer0 11051
joinChannel Org2 org2 peer1 13051
joinChannel Org3 org3 peer0 15051
joinChannel Org3 org3 peer1 17051
joinChannel Org3 org3 peer2 19051
# joinChannel Orgname orgname peernumber portpeer

## Set the anchor peers for each org in the channel
infoln "Setting anchor peer for org1..."
setAnchorPeer Org1 org1 peer0 7051
setAnchorPeer Org1 org1 peer1 9051
setAnchorPeer Org2 org2 peer0 11051
setAnchorPeer Org2 org2 peer1 13051
setAnchorPeer Org3 org3 peer0 15051
setAnchorPeer Org3 org3 peer1 17051
setAnchorPeer Org3 org3 peer2 19051
# setAnchorPeer Orgname orgname peernumber portpeer

successln "Channel '$CHANNEL_NAME' joined"
