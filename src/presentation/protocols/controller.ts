import type { HttpRequest, HttpResponse } from '../protocols/http'

export interface Controller {
  handle: (request: HttpRequest) => HttpResponse
}
