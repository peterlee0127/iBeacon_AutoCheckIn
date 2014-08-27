var crypto = require('crypto');

exports.encrypt = function encryption(plain) {
 var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8');
  var text = plain;
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');

  return crypted;
}
