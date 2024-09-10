import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Eduardo',
        email: 'eduardo.almeida@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
