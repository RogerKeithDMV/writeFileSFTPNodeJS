let Client = require('ssh2-sftp-client');
const fs = require('fs');
let sftp = new Client();
const log = require('../../helpers/logger');
const rabbitmq = require('../../helpers/rabbit');

const ERROR_PROPERTY = 'Error missing property';

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}){
    try {

        log.info("Inside processTrigger()");
        log.info("Config=" + JSON.stringify(cfg));
        log.info("Config=" + JSON.stringify(cfg));
        log.info("Snapshot=" + JSON.stringify(snapshot));

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
          this.emit('', '${ERROR_PROPERTY} data');
          throw new Error('${ERROR_PROPERTY} data');
        }

        Object.keys(properties).forEach((value) => {

          if (data.hasOwnProperty(value)) {

              properties[value] = data[value];

          } else if (cfg.hasOwnProperty(value)) {

              properties[value] = cfg[value];

          } else {

              log.error(`${ERROR_PROPERTY} ${value}`);

              throw new Error(`${ERROR_PROPERTY} ${value}`);

          }

      });

        log.info("The nameNewFile is: " + properties.nameNewFile);

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

        this.emit('data', {data});
        console.log("respuesta: ",data);
        this.emit('snapshot', snapshot);

        log.info('Finished api execution');
        this.emit('end');
    } catch (e) {
        log.error(`ERROR: ${e}`);
        this.emit('error', e);
        await rabbitmq.producerMessage(e);
    }

    finally{
      console.log("Entando a finally");
      sftp.end();
      console.log("Termina finally");
    }
};