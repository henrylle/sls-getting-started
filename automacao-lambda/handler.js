'use strict';
var AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' });
var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

module.exports.stop_ec2 = (event, context, callback) => {
  var params = {
    DryRun: false
  }
  ec2.describeInstances(params, function (err, data) {
    if (err) {
      console.log("Erro", err.stack);
      callback(err, "Erro ao executar operação de describe");
    } else {
      let instanceId = data.Reservations[0].Instances[0].InstanceId;
      console.log("Sucesso", JSON.stringify(data));
      stopInstance(instanceId, callback);      
    }
  });
};


function stopInstance(instanceID, callback) {
  var params = {
    InstanceIds: [instanceID],
    DryRun: false
  };
  ec2.stopInstances(params, function (err, data) {
    if (err) {
      console.log("Erro", err);
      callback(err, 'Erro ao executar stop');

    } else if (data) {
      console.log("Sucesso", data.StoppingInstances);
      callback(null, "Operação de stop executada com sucesso!");
    }
  });
}