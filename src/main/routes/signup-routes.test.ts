import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    const mongoConnString = process.env.MONGO_URL
    if (!mongoConnString) {
      throw new Error('MONGO_URL not set in env')
    }
    await MongoHelper.connect(mongoConnString)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
