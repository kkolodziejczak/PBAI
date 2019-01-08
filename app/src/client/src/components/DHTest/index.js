import React from 'react';
import {diffieHellman, 
  decodeDH, encode, 
  decode, 
  base64encode, 
  base64decode} from 'helpers/index';

export const OWNER_PRIVATE_KEY = encode('ownerPrivateKey', 'ownerPrivateKey');
export const PARTNER_PRIVATE_KEY = encode('partnerPrivateKey', 'partnerPrivateKey');

const GENERATOR = 'Ag==';
const PRIME =
  'r+pGR+exWIBfvd48XIYB16qtXILdw2524DlFB0s7O6R76dxlOnRNYUfF2dS11ZC5nXe4X5DI8VDYrmtAPvc73FTynaNk25kt0Yreh8BCR3JYlJNMQZavalHBJOIPrvNChg31mQGK6SMzD1ECHR/7mt6A75S1vnBFgLuMoYwLDqxpKtDCFhd3j8YUyu8dU4kvFZfCwmqYxqHdqpkLXi06uzsFM0CXvhgaPD9qRpcDh54NjThpt/UfT4Dygm9Uj0Nlxw+Nwr4MmSHlbSDS6lZNOytJXwkiHxNHlE6j16Fe+ZvmJRMX+WUUahaTLdFfE4nbJJ1KGV+PMBA642aj+Ydfkw==';

const PASSWORD_TO_CRYPT = '11111111';

function test() {
  
  const assert = (b,s) => {if (!b) throw new Error(s)}

  const OWNER_PRIVATE_KEY = encode('ownerPrivateKey', 'ownerPass');
  const PARTNER_PRIVATE_KEY = encode('partnerPrivateKey', 'partnerPass');

  assert(decode(OWNER_PRIVATE_KEY, 'ownerPass')==='ownerPrivateKey', 24)
  assert(decode(PARTNER_PRIVATE_KEY, 'partnerPass')==='partnerPrivateKey', 25) 

  const GENERATOR = 'Ag==';
  const PRIME =
    'r+pGR+exWIBfvd48XIYB16qtXILdw2524DlFB0s7O6R76dxlOnRNYUfF2dS11ZC5nXe4X5DI8VDYrmtAPvc73FTynaNk25kt0Yreh8BCR3JYlJNMQZavalHBJOIPrvNChg31mQGK6SMzD1ECHR/7mt6A75S1vnBFgLuMoYwLDqxpKtDCFhd3j8YUyu8dU4kvFZfCwmqYxqHdqpkLXi06uzsFM0CXvhgaPD9qRpcDh54NjThpt/UfT4Dygm9Uj0Nlxw+Nwr4MmSHlbSDS6lZNOytJXwkiHxNHlE6j16Fe+ZvmJRMX+WUUahaTLdFfE4nbJJ1KGV+PMBA642aj+Ydfkw==';

  const PASSWORD_TO_CRYPT = '11111111';

  const {publicKey: OWNER_PUBLIC_KEY} = diffieHellman(PRIME, GENERATOR, OWNER_PRIVATE_KEY);

  const {publicKey: PARTNER_PUBLIC_KEY} = diffieHellman(PRIME, GENERATOR, PARTNER_PRIVATE_KEY);

  const {publicKey: OWNER_PUBLIC_KEY2, encoded: ENCODED_PASSWORD} = diffieHellman(
    PRIME,
    GENERATOR,
    OWNER_PRIVATE_KEY,
    PARTNER_PUBLIC_KEY,
    PASSWORD_TO_CRYPT,
  );

  assert(
    decodeDH(
      PRIME, GENERATOR, 
      OWNER_PRIVATE_KEY, PARTNER_PUBLIC_KEY, ENCODED_PASSWORD
    )===PASSWORD_TO_CRYPT
    ,45
  )
  assert(
    decodeDH(
      PRIME, GENERATOR, 
      PARTNER_PRIVATE_KEY, OWNER_PUBLIC_KEY, ENCODED_PASSWORD
    )===PASSWORD_TO_CRYPT
    ,52
  )

}

export default class DHText extends React.Component {
  componentDidMount() {
    test();
  }

  render() {
    return <div />;
  }
}
