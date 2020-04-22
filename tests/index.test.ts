import NASH from '../src/index';

test('nash | encrypt', () => {
  const plainText = NASH.s2i('testtest');
  const key = 'testtesttesttest';
  const cipherText = NASH.encrypt(plainText, key);

  expect(NASH.i2h(cipherText)).toEqual('5fe8e742d21000f9')
  expect(NASH.decrypt(cipherText, key)).toEqual(plainText);
});
