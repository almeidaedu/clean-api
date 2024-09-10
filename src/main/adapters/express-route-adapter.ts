import type { Controller, HttpRequest } from '../../presentation/protocols'
import type { Request, RequestHandler, Response, NextFunction } from 'express'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    controller.handle(httpRequest)
      .then(httpResponse => {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      })
      .catch(error => {
        next(error)
      })
  }
}
