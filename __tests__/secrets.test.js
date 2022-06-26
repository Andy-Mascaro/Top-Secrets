const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { UserService } = require('../lib/services/UserService');

const fakeUser = {
  first_name: 'Bobby',
  last_name: 'Roberts',
  email: 'bob@bob.com',
  password: '111111',
};

const signupSignin = async (userInfo = {}) => {
  const password = userInfo.password ?? fakeUser.password;
  const auth = request.agent(app);
  const user = await UserService.create({ ...fakeUser, ...userInfo });
  const { first_name, last_name, email } = user;
  await auth
    .post('/api/v1/users/sessions')
    .send({ first_name, last_name, email, password });
  return [auth, user];
};
// const posting = async () => {
//   const auth = request.agent(app);
//   await auth.get('/api/v1/users/sessions');
//   return auth;
// };

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('/ should show secrets', async () => {
    const [auth] = await signupSignin({ email: 'admin' });
    const res = await auth.get('/api/v1/secrets');

    expect(res.body).toEqual([
      {
        id: '1',
        title: 'Can you see this',
        description: 'If so and are not authorized you are going jail',
        created_at: expect.any(String),
      },
    ]);
  });

  //   it('POST should create new secret', async () => {
  //     const auth = await posting();
  //     const resp = await auth.post('/api/v1/secrets').send({
  //       title: 'Do not look',
  //       description: 'Peeking is a no no',
  //       created_at: Date.now(),
  //     });

  //     expect(resp.body).toEqual('title', 'Do not look');
  //     expect(resp.body).toEqual('description', 'Peeking is a no no');
  //     expect(resp.body).toEqual('created_at', Date.now());
  //   });

  afterAll(() => {
    pool.end();
  });
});
