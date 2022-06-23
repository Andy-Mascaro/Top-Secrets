const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { UserService } = require('../lib/services/UserService');

const fakeUser = {
  email: 'bob@bob.com',
  password: '111111',
};

const signupSignin = async (userInfo = {}) => {
  const password = userInfo.password ?? fakeUser.password;
  const auth = request.agent(app);
  const user = await UserService.create({ ...fakeUser, ...userInfo });
  const { email } = user;
  await auth.post('/api/v1/users/sessions').send({ email, password });
  return [auth, user];
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('POST should create new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(fakeUser);
    const { email } = fakeUser;

    expect(resp.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('should return user', async () => {
    const [auth, user] = await signupSignin();
    const person = await auth.get('/api/v1/users/person');

    expect(person.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
});
