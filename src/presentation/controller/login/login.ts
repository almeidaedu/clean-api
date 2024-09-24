import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import type { Controller, HttpRequest, HttpResponse } from '../../protocols'

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

    return await new Promise(resolve => { resolve({ statusCode: 200, body: {} }) })
  }
}
