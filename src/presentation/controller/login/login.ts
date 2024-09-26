import { InvalidParamError } from '../../errors'
import { badRequest, serverError, successRequest, unauthorized } from '../../helpers/http/http-helper'
import type { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-protocols'

interface LoginRequestBody {
  email: string
  password: string
}

function isLoginRequestBody (body: unknown): body is LoginRequestBody {
  if (body !== null && typeof body === 'object') {
    return 'email' in body &&
    'password' in body
  }

  return false
}

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const requiredFields = ['email', 'password']
      if (!isLoginRequestBody(httpRequest.body)) {
        return badRequest(new InvalidParamError(requiredFields.join(', ')))
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth(email, password)

      if (!accessToken) {
        return unauthorized()
      }

      return successRequest({ accessToken })
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error)
      } else {
        return serverError(new Error('Unknown error'))
      }
    }
  }
}
