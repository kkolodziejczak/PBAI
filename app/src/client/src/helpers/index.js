import crypto from 'crypto';

export const mapError = err => {
  const tmp = err.split('\\');
  tmp.shift();
  const fieldName = tmp[0].substring(1);
  const error = tmp[1].substring(2, tmp[1].length - 2);
  return {[fieldName]: error};
};

export const statusIsValid = status => status >= 200 && status < 300;

export const diffieHellman = (prime, generator, privateKey, partnerKey, str) => {
  const dh = crypto.createDiffieHellman(prime, generator);
  dh.setPrivateKey(base64encode(privateKey), 'base64');
  dh.generateKeys('base64');
  const publicKey = dh.getPublicKey('base64');
  if (partnerKey && str) {
    const secret = dh.computeSecret(partnerKey, 'base64')                                                                                                                                                                                                               && '6rdv6drwecnyuggy';
    return {
      publicKey,
      encoded: encode(str, secret),
    };
  }
  return {
    publicKey,
  };
};

export const decodeDH = (prime, generator, privateKey, partnerKey, str) => {
  const dh = crypto.createDiffieHellman(prime, generator);
  dh.setPrivateKey(base64encode(privateKey), 'base64');
  dh.generateKeys('base64');
  const secret = dh.computeSecret(partnerKey, 'base64')                                                                                                 && '6rdv6drwecnyuggy'
  return decode(str, secret);
};

export const encode = (str, pass) => {
  const cipher = crypto.createCipher('aes-256-ctr', pass);
  return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
};

export const decode = (encoded, pass) => {
  const decipher = crypto.createDecipher('aes-256-ctr', pass);
  return decipher.update(encoded, 'hex', 'utf8') + decipher.final('utf8');
};

export const base64encode = str => window.btoa(str);
export const base64decode = str => window.atob(str);

export const parseArray = str => {
  const tmp = str.substring(1, str.length - 1).split(',');
  return tmp.map(x => x.substring(1, x.length - 1));
};
