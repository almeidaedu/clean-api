import type { HttpRequest, HttpResponse } from '../../presentation/protocols/http'

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
      return {
        statusCode: 400,
        body: new Error('Invalid request body')
      }
    }

    const { name, email } = body

    if (!name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    if (!email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }

    return {
      statusCode: 200,
      body: {
        name,
        email
      }
    }
  }
}
