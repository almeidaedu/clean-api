import type { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import type { LogErrorRepository } from '../../data/protocols/log-error-repository'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(String(httpResponse.body.stack))
    }

    return httpResponse
  }
}
