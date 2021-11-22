const util = require('util');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const copyFilePromise = util.promisify(fs.copyFile);
var wrench = require('wrench');

//Função para auxilio
async function processLineByLine(file) {
   const fileStream = fs.createReadStream(file);

   const rl = readline.createInterface({
   input: fileStream,
   crlfDelay: Infinity
   } );
   for await (const line of rl) {
   // Each line in input.txt will be successively available here as `line`.
   console.log(`${line}`);
   };
};

const replaceFile = (contents, stringReplace, value) => {
   return new Promise( (resolve, reject) => {
   switch(stringReplace) {
      case 'orgname':
         var newValue = String(contents).replace(/orgname/g,  value);
         resolve(newValue);
         break;
      case 'Orgname':
         var newValue = String(contents).replace(/Orgname/g, value);
         resolve(newValue);
         break;
      case 'networkname':
         var newValue = String(contents).replace(/networkname/g, value);
         resolve(newValue);
         break;   
      case 'portca':
         var newValue = String(contents).replace(/portca/g, value);
         resolve(newValue);
         break;
      case 'portcouchdb':
         var newValue = String(contents).replace(/portcouchdb/g, value);
         resolve(newValue);
         break;
      case 'portpeer':
         var newValue = String(contents).replace(/portpeer/g, value);
         resolve(newValue);
         break;
      case 'portpeer2':
         var newValue = String(contents).replace(/portpeer2/g, value);
         resolve(newValue);
         break;
      case 'couchdbnumber':
         var newValue = String(contents).replace(/couchdbnumber/g, 'couchbd'+ value);
         resolve(newValue);
         break;
      case 'peernumber':
         var newValue = String(contents).replace(/peernumber/g, 'peer' + value);
         resolve(newValue);
         break;
      case 'numpeer':
         var newValue = String(contents).replace(/numpeer/g, value);
         resolve(newValue);
         break;
      case 'quant':
         var newValue = String(contents).replace(/quant/g, value);
         resolve(newValue);
         break;
      case 'channelName':
         var newValue = String(contents).replace(/channelName/g, value);
         resolve(newValue);
         break;
      case 'total':
         var newValue = String(contents).replace(/total/g, value);
         resolve(newValue);
         break;
      case 'text':
         var newValue = String(contents).replace(/text/g, value);
         resolve(newValue);
         break;
      default:
         console.log('Não encontou a opção ' + stringReplace);
   }
   } )
};

const readFile = (file) => {
   return new Promise( (resolve, reject) => {
   fs.readFile(file, (err, data) => {
      if (err) {
         return reject(err);
      } else {
         return resolve(data); 
      }
   } );
   //processLineByLine(file);
   } );
};

async function readDirectory(path) {
   return new Promise ( (resolve, reject) => {
      fs.readdir(path, function(err, items) {
         if (err) 
            reject(err);
         else {
            var array = []
            items.map(function(element){
               fs.stat(path+"/"+element, async function(err, stats){
                  if(err) {
                     throw err;  
                  }
                  else{ // Se a rede existir
                     array.push(element);
                     console.log(array)
                  }
               })      
            })
            resolve(array);
         }
      } );
   } )
}

//Escreve no arquivo
const writeFile = (file, contents) => {
   return new Promise ( (resolve, reject) => {
   fs.writeFile(file, contents, (err) => {
      if (err)
         return reject('Erro ao escrever o arquivo (' + err + ')');
      resolve('Seccess');
   } )
   } )
}
//Adiciona no arquivo
const appendFile = ( file, contents ) => {
   return new Promise ( (resolve, reject) => {
   fs.appendFile( file, contents, (err) => {
      if (err)
         return reject('Erro ao anexar ao arquivo (' + ')' );
      resolve('Seccess');
   } )
   } )
}

const changeWriting = async (file, option, value) => {
   if (option != null) {
      let fileReader = await readFile(file); // Efetua a leitura do arquivo
      let fileReplace = await Promise.resolve (replaceFile(String(fileReader), option, value)); // Efetua a troca do escrito
      await Promise.resolve(writeFile(file, fileReplace)); // Escreve no arquivo com os dados alterados
   } else {
      let fileReader = await readFile(file); 
      await Promise.resolve(writeFile(file, fileReader));
   }
}

const appendWriting = async (fileOrigin, fileDestiny, option, value) => {
   if (option == null) {
      let fileReader = await readFile(fileOrigin); // Efetua a leitura do arquivo
      await Promise.resolve(appendFile(fileDestiny, fileReader)); // Escreve no arquivo com os dados alterados
   } else {
      let fileReader = await readFile(fileOrigin);
      let fileReplace = await Promise.resolve (replaceFile(String(fileReader), option, value));
      await Promise.resolve(appendFile(fileDestiny, fileReplace));
   }

}

const copyFiles = async (srcDir, destDir) => {
   var files = await readDirectory(srcDir);
   console.log(files);
   return Promise.all(files.map(function(element){
      console.log(element)
      return copyFilePromise(path.join(srcDir, element), path.join(destDir, element));
   }));
}

const recCopy =  async (srcDir, destDir) => {
wrench.copyDirSyncRecursive(srcDir, destDir);
}

const deleteFolderRecursive = async (pathFile) => {
if (fs.existsSync(pathFile)) {
  fs.readdirSync(pathFile).forEach((file, index) => {
    const curPath = path.join(pathFile, file);
    if (fs.lstatSync(curPath).isDirectory()) { // recurse
      deleteFolderRecursive(curPath);
    } else { // delete file
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(pathFile);
}
}

module.exports = {
   deleteFolderRecursive,
   recCopy,
   copyFiles,
   appendWriting,
   changeWriting,
   writeFile
}
