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

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST should create new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(fakeUser);
    const { first_name, last_name, email } = fakeUser;

    expect(resp.body).toEqual({
      id: expect.any(String),
      first_name,
      last_name,
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

  it('should return a 401 when signed out and listing all users', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401,
    });
  });

  it('should return a 403 when signed in but not admin and listing all users', async () => {
    const [auth] = await signupSignin();
    const res = await auth.get('/api/v1/users');

    expect(res.body).toEqual({
      message: 'You do not have access to view this page',
      status: 403,
    });
  });

  it('should return a list of users if signed in as admin', async () => {
    const [auth, user] = await signupSignin({ email: 'admin' });
    const res = await auth.get('/api/v1/users');

    expect(res.body).toEqual([{ ...user }]);
  });

  afterAll(() => {
    pool.end();
  });
});
