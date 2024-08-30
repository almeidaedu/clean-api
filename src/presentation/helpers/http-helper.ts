import type { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const successRequest = (data: HttpResponse): HttpResponse => ({
  statusCode: 200,
  body: data
})
