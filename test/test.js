let Client = require('ssh2-sftp-client');
const fs = require('fs');
let sftp = new Client();
const { request } = require('express');
const fs = require('fs');

const ERROR_PROPERTY = 'Error missing property';

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
    if(key){
      sftp
      .connect({host: hostReq,
        port: portReq,
        username: usernameReq,
        privateKey:fs.readFileSync(key)})
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
}