const fs = require('fs');
const fsex = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const readline = require('readline');
const crypto = require('crypto');

const extra = require('./extra');
const creatShFiles = require('./createShFiles');

module.exports = {
   validaNomeOrg(nomeOrg){
      for (let i = 0; i < nomeOrg.length; i++) {
         let str = nomeOrg[i];
         nomeOrg[i] = str[0].toUpperCase() + str.substr(1);
      }
   },
   validaNomeCanal(nomeCanal){
      nomeCanal = nomeCanal.toLocaleLowerCase()
      console.log(nomeCanal);
   }
}