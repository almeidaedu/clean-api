import type { AccountModel } from '../../controller/signup/signup-protocols'
import { ServerError, UnauthorizedError } from '../../errors'
import type { HttpResponse } from '../../protocols/http'

interface AuthResponse {
  accessToken: string
}

type SuccessResponse = AccountModel | AuthResponse

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
export const successRequest = (data: SuccessResponse): HttpResponse => ({
  statusCode: 200,
  body: data
})
