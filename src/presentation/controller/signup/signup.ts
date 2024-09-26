import type { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './signup-protocols'
import { InvalidParamError } from '../../errors'
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
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      if (!isSignUpRequestBody(httpRequest.body)) {
        return badRequest(new InvalidParamError(requiredFields.join(', ')))
      }

      const { name, email, password } = httpRequest.body

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
