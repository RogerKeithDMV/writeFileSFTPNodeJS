let Client = require('ssh2-sftp-client');
const fs = require('fs');
let sftp = new Client();

async function SFTPServerConnectionUpload({host, port, username, password, base64, path, nameNewFile, key}){
  return new Promise(function(resolve, reject) {
    if(key){
      sftp
      .connect({host: host,
        port: port,
        username: username,
        privateKey: fs.readFileSync(key)
      })
      .then(() => {
        try{
          const buf = base64;
          return sftp.put(Buffer.from(buf, "base64"), path + nameNewFile);
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
    .connect({host: host,
      port: port,
      username: username,
      password: password})
    .then(() => {
      try{
        const buf = base64;
        return sftp.put(Buffer.from(buf, "base64"), path + nameNewFile);
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

module.exports={SFTPServerConnectionUpload}