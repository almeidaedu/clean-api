import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import type { Controller, HttpRequest, HttpResponse } from '../../protocols'
import type { EmailValidator } from '../../protocols/email-validator'

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
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    if (!isLoginRequestBody(httpRequest.body)) {
      return badRequest(new InvalidParamError(requiredFields.join(', ')))
    }

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = httpRequest.body

    const isValid = this.emailValidator.isValid(email)

    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return await new Promise(resolve => { resolve({ statusCode: 200, body: {} }) })
  }
}
