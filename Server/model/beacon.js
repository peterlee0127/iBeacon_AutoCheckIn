var fs = require('fs');
var model = require('./model.js');

exports.readBeaconFromJSON=function readBeaconFromJSON(){
  var data = fs.readFileSync('./public/iBeacon.json','utf8')
  var result = JSON.parse(data);
  for(var i=0;i<result.length;i++){
      var beacon = result[i];
      model.iBeacon.create(
      {
          'beacon_id'	  :beacon.beacon_id,
          'identifier'	:beacon.identifier,
          'major'	      :beacon.major,
          'minor'       :beacon.minor,
          'range'       :beacon.range
      },function(err,beacon){
          if(err){
            console.log("add beacon error:"+errpr);
          }
          else{
            //add successful
          }
      });
  }
  return result;
}
