import React from 'react';
import {diffieHellman, decodeDH, encode, decode, base64encode, base64decode} from 'helpers/index';

export const OWNER_PRIVATE_KEY = encode('ownerPrivateKey', 'ownerPrivateKey');
export const PARTNER_PRIVATE_KEY = encode('partnerPrivateKey', 'partnerPrivateKey');

const GENERATOR = 'Ag==';
const PRIME =
  'r+pGR+exWIBfvd48XIYB16qtXILdw2524DlFB0s7O6R76dxlOnRNYUfF2dS11ZC5nXe4X5DI8VDYrmtAPvc73FTynaNk25kt0Yreh8BCR3JYlJNMQZavalHBJOIPrvNChg31mQGK6SMzD1ECHR/7mt6A75S1vnBFgLuMoYwLDqxpKtDCFhd3j8YUyu8dU4kvFZfCwmqYxqHdqpkLXi06uzsFM0CXvhgaPD9qRpcDh54NjThpt/UfT4Dygm9Uj0Nlxw+Nwr4MmSHlbSDS6lZNOytJXwkiHxNHlE6j16Fe+ZvmJRMX+WUUahaTLdFfE4nbJJ1KGV+PMBA642aj+Ydfkw==';

const PASSWORD_TO_CRYPT = '11111111';

function test() {
  console.log('--------------------------------');
  //owner sends his public key
  const {publicKey: OWNER_PUBLIC_KEY} = diffieHellman(PRIME, GENERATOR, OWNER_PRIVATE_KEY);

  //partner sends his public key
  const {publicKey: PARTNER_PUBLIC_KEY} = diffieHellman(PRIME, GENERATOR, PARTNER_PRIVATE_KEY);

  //owner encrypts his password
  const {encoded: ENCODED_PASSWORD} = diffieHellman(
    PRIME,
    GENERATOR,
    OWNER_PRIVATE_KEY,
    PARTNER_PUBLIC_KEY,
    PASSWORD_TO_CRYPT,
  );

  console.log('ENCODED_PASSWORD', ENCODED_PASSWORD);
  const DECODED_PASSWORD = decodeDH(PRIME, GENERATOR, PARTNER_PRIVATE_KEY, OWNER_PUBLIC_KEY, ENCODED_PASSWORD);

  console.log('INITIAL_PASSWORD', PASSWORD_TO_CRYPT);
  console.log('DECODED_PASSWORD', DECODED_PASSWORD);
}

export default class DHText extends React.Component {
  componentDidMount() {
    test();
  }

  render() {
    return <div />;
  }
}
