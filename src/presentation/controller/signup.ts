import type { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { MissingParamError } from '../errors/missing-params.error'
import { badRequest, successRequest } from '../helpers/http-helper'

interface ISignUpRequestBody {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

function isSignUpRequestBody (body: unknown): body is ISignUpRequestBody {
  if (body !== null && typeof body === 'object') {
    return 'name' in body &&
    'email' in body &&
    'password' in body &&
    'passwordConfirmation' in body
  }

  return false
}

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest

    if (!isSignUpRequestBody(body)) {
      return badRequest(new Error('Invalid request body'))
    }

    const { name, email } = body

    if (!name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    return successRequest({
      statusCode: 200,
      body: {
        message: 'User created successfully'
      }
    })
  }
}
