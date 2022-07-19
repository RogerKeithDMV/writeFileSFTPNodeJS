let Client = require('ssh2-sftp-client');
const fs = require('fs');
let sftp = new Client();
const { request } = require('express');
//const log = require('../../helpers/logger');
//const rabbitmq = require('../../helpers/rabbit');

const ERROR_PROPERTY = 'Error missing property';

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}){
    try {

        console.log("Inside processTrigger()");
        console.log("Config=" + JSON.stringify(cfg));
        console.log("Config=" + JSON.stringify(cfg));
        console.log("Snapshot=" + JSON.stringify(snapshot));

        console.log("msg=" + JSON.stringify(msg));

        let properties = {
            host: null, 
            port: null, 
            username: null, 
            password: null, 
            base64: null, 
            path: null, 
            nameNewFile: null,
            key: null
        };

        let {data} = {msg};

        if(!data){
          log.info('', '${ERROR_PROPERTY} data');
          //throw new Error('${ERROR_PROPERTY} data');
        }

        Object.keys(properties).forEach((value) => {

          if (data.hasOwnProperty(value)) {

              properties[value] = data[value];

          } else if (cfg.hasOwnProperty(value)) {

              properties[value] = cfg[value];

          } else {

            console.log(`${ERROR_PROPERTY} ${value}`);

              //throw new Error(`${ERROR_PROPERTY} ${value}`);

          }

      });

      console.log("The nameNewFile is: " + properties.nameNewFile);

        if(properties.key){
          data = await sftp.connect({
            host:properties.host,
            port:properties.port,
            username:properties.username,
            privateKey:fs.readFileSync(properties.key)
          })
          .then(() => {
            try{
              const buf = base64;
              return sftp.put(Buffer.from(buf, "base64"), path + nameNewFile);
            }
            catch(err){
              res.status(500).json(err);
            }
          });
        }

        else{
          data = await sftp.connect({
            host:properties.host,
            port:properties.port,
            username:properties.username,
            password:properties.password
          })
          .then(() => {
            try{
              const buf = base64;
              return sftp.put(Buffer.from(buf, "base64"), path + nameNewFile);
            }
            catch(err){
              res.status(500).json(err);
            }
          });
        }

        log.info('data', {data});
        console.log("respuesta: ",data);
        log.info('snapshot', snapshot);

        log.info('Finished api execution');
        log.info('end');
    } catch (e) {
        log.error(`ERROR: ${e}`);
        log.info('error', e);
        //await rabbitmq.producerMessage(e);
    }

    finally{
      console.log("Entando a finally");
      sftp.end();
      console.log("Termina finally");
    }
};

/*let Client =  require('ssh2-sftp-client');
const express = require('express');
const { request } = require('express');
const rabbitmq = require('../helpers/rabbit');
const fs = require('fs');

let sftp = new Client();
const app = express();
app.use(express.json());

var hostReq="";
var portReq="";
var usernameReq="";
var passwordReq="";
var pathReq="";
var nameNewFileReq="";
var base64Req="";
var keyReq="";

app.post('/', async(req, res)=>{
  hostReq=req.body.host;
  portReq=req.body.port;
  usernameReq=req.body.username;
  passwordReq=req.body.password;
  pathReq=req.body.path;
  nameNewFileReq=req.body.nameNewFile;
  base64Req=req.body.base64;
  keyReq=req.body.key;

  try{
    const uploadRes = await SFTPServerConnectionUpload();
    res.json(uploadRes);
  }
  catch(err){
    res.status(500).json(err);
  }
})

app.listen(3000, ()=>{
  console.log("Server ejecutandose en el puerto 3000");
});

async function SFTPServerConnectionUpload(){
  return new Promise(function(resolve, reject) {
    if(keyReq){
      sftp
      .connect({host: hostReq,
        port: portReq,
        username: usernameReq,
        privateKey: fs.readFileSync(keyReq)
      })
      .then(() => {
        try{
          const buf = base64Req;
          return sftp.put(Buffer.from(buf, "base64"), pathReq + nameNewFileReq);
        }
        catch(err){
          res.status(500).json(err);
        }
      })
      .then(resolve)
      .then(() => sftp.end())
      .catch(reject)
    }
    else{
      sftp
    .connect({host: hostReq,
      port: portReq,
      username: usernameReq,
      password: passwordReq})
    .then(() => {
      try{
        const buf = base64Req;
        return sftp.put(Buffer.from(buf, "base64"), pathReq + nameNewFileReq);
      }
      catch(err){
        res.status(500).json(err);
      }
    })
    .then(resolve)
    .then(() => sftp.end())
    .catch(reject)
  }
  });
}*/