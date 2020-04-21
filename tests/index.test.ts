import encrypt from '../src/index';

test('nash | encrypt', () => {
  expect(
    encrypt('testtesttesttest', 'testtesttesttest')
  ).toEqual('746570387465751f746570387465751f')
});
