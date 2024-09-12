import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  const mongoUrl = process.env.MONGO_URL
  if (!mongoUrl) {
    throw new Error('MONGO_URL is not defined')
  }

  beforeAll(async () => {
    await sut.connect(mongoUrl)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('test')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('test')
    expect(accountCollection).toBeTruthy()
  })
})
