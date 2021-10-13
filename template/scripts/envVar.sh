#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

# imports
. scripts/utils.sh

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
# Set environment variables for the peer org
setGlobals() {
  local ORG_NAME=$1
  local org_NAME=$2
  local PEER_NUMBER=$3
  local PORT_PEER=$4

  infoln "Using organization ${ORG_NAME} peer ${PEER_NUMBER}"

  export CORE_PEER_LOCALMSPID="${ORG_NAME}MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/${org_NAME}.example.com/peers/${PEER_NUMBER}.${org_NAME}.example.com/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/${org_NAME}.example.com/users/Admin@${org_NAME}.example.com/msp
  export CORE_PEER_ADDRESS=localhost:${PORT_PEER}

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}
# Set environment variables for use in the CLI container 
setGlobalsCLI() {
  local ORG_NAME=$1
  local org_NAME=$2
  local PEER_NUMBER=$3
  local PORT_PEER=$4

  setGlobals ${ORG_NAME} ${org_NAME} ${PEER_NUMBER} ${PORT_PEER}

  export CORE_PEER_ADDRESS=${PEER_NUMBER}.${ORG_NAME}.example.com:${PORT_PEER}
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {
  PEER_CONN_PARMS=""
  PEERS=""
  
  for counter in {1..total}; 
  do
    setGlobals $1 $2 $3 $4

    PEER="$3.$2"
    ## Set peer addresses
    PEERS="$PEERS $PEER"
    PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
    ## Set path to TLS certificate
    TLSINFO=$(eval echo "--tlsRootCertFiles ${PWD}/organizations/peerOrganizations/$2.example.com/peers/$3.$2.example.com/tls/ca.crt")
    PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    # shift by one to get to the next organization
    shift 4
  done
  PEERS="$(echo -e "$PEERS" | sed -e 's/^[[:space:]]*//')"
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}