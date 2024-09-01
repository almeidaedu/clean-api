import type { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import { MissingParamError } from '../errors/missing-params.error'
import { InvalidParamError } from '../errors/invalid-params.error'
import { badRequest, successRequest } from '../helpers/http-helper'
import type { Controller } from '../protocols/controller'
import type { EmailValidator } from '../protocols/email-validator'

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

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    if (!isSignUpRequestBody(body)) {
      return badRequest(new InvalidParamError(requiredFields.join(', ')))
    }

    for (const field of requiredFields) {
      if (!body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isValid = this.emailValidator.isValid(body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return successRequest({
      statusCode: 200,
      body: {
        message: 'User created successfully'
      }
    })
  }
}
