function createOrgname() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/orgname.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/orgname.example.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:portca --caname ca-orgname --tls.certfiles ${PWD}/organizations/fabric-ca/orgname/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-portca-ca-orgname.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-portca-ca-orgname.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-portca-ca-orgname.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-portca-ca-orgname.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/orgname.example.com/msp/config.yaml


  for i in {0..numpeer}; do

    infoln "Registering peer${i}"
    set -x
    fabric-ca-client register --caname ca-orgname --id.name peer${i} --id.secret peer${i}pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/orgname/tls-cert.pem
    { set +x; } 2>/dev/null

    infoln "Registering user"
    set -x
    fabric-ca-client register --caname ca-orgname --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/orgname/tls-cert.pem
    { set +x; } 2>/dev/null

    infoln "Registering the org admin"
    set -x
    fabric-ca-client register --caname ca-orgname --id.name orgnameadmin --id.secret orgnameadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/orgname/tls-cert.pem
    { set +x; } 2>/dev/null

    infoln "Generating the peer${i} msp"
    set -x
    fabric-ca-client enroll -u https://peer${i}:peer${i}pw@localhost:portca --caname ca-orgname -M ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/msp --csr.hosts peer${i}.orgname.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/orgname/tls-cert.pem
    { set +x; } 2>/dev/null

    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/msp/config.yaml

    infoln "Generating the peer${i}-tls certificates"
    set -x
    fabric-ca-client enroll -u https://peer${i}:peer${i}pw@localhost:portca --caname ca-orgname -M ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls --enrollment.profile tls --csr.hosts peer${i}.orgname.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/orgname/tls-cert.pem
    { set +x; } 2>/dev/null

    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls/ca.crt
    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls/server.crt
    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls/server.key

    mkdir -p ${PWD}/organizations/peerOrganizations/orgname.example.com/msp/tlscacerts
    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/orgname.example.com/msp/tlscacerts/ca.crt

    mkdir -p ${PWD}/organizations/peerOrganizations/orgname.example.com/tlsca
    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/orgname.example.com/tlsca/tlsca.orgname.example.com-cert.pem

    mkdir -p ${PWD}/organizations/peerOrganizations/orgname.example.com/ca
    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/peers/peer${i}.orgname.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/orgname.example.com/ca/ca.orgname.example.com-cert.pem

    infoln "Generating the user msp"
    set -x
    fabric-ca-client enroll -u https://user1:user1pw@localhost:portca --caname ca-orgname -M ${PWD}/organizations/peerOrganizations/orgname.example.com/users/User1@orgname.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/orgname/tls-cert.pem
    { set +x; } 2>/dev/null

    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/orgname.example.com/users/User1@orgname.example.com/msp/config.yaml

    infoln "Generating the org admin msp"
    set -x
    fabric-ca-client enroll -u https://orgnameadmin:orgnameadminpw@localhost:portca --caname ca-orgname -M ${PWD}/organizations/peerOrganizations/orgname.example.com/users/Admin@orgname.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/orgname/tls-cert.pem
    { set +x; } 2>/dev/null

    cp ${PWD}/organizations/peerOrganizations/orgname.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/orgname.example.com/users/Admin@orgname.example.com/msp/config.yaml
  done
}

