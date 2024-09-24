import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

describe('Login Controller', () => {
  test('should return 400 if the request body is invalid', async () => {
    const requiredFields = ['email', 'password']
    const sut = new LoginController()

    const httpRequest = {
      body: {
        user: null,
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError(requiredFields.join(', ')))
  })

  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()

    const httpRequest = {
      body: {
        email: null,
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const sut = new LoginController()

    const httpRequest = {
      body: {
        email: 'any_email',
        password: null
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
