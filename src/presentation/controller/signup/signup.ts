import type { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, successRequest } from '../../helpers/http-helper'

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
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      if (!isSignUpRequestBody(httpRequest.body)) {
        return badRequest(new InvalidParamError(requiredFields.join(', ')))
      }

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return successRequest(account)
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error)
      } else {
        return serverError(new Error('Unknown error'))
      }
    }
  }
}
