setAnchorPeer() {
  ORG_NAME=$1
  org_NAME=$2
  PEER_NUMBER=$3
  PORT_PEER=$4
  docker exec cli ./scripts/setAnchorPeer.sh $ORG_NAME $CHANNEL_NAME $org_NAME $PEER_NUMBER $PORT_PEER
}

