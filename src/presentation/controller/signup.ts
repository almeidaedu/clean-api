import type { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, successRequest, serverError } from '../helpers/http-helper'

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
    try {
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
    } catch (error) {
      return serverError()
    }
  }
}
