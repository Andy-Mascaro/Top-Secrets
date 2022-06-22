const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const fakeUser = {
  email: 'bob@bob.com',
  password: '111111',
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('POST should create new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(fakeUser);
    const { email, password } = fakeUser;

    expect(resp.body).toEqual({
      id: expect.any(String),
      email,
      password,
    });
  });
  afterAll(() => {
    pool.end();
  });
});
