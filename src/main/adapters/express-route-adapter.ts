import type { Controller, HttpRequest } from '../../presentation/protocols'
import type { Request, RequestHandler, Response, NextFunction } from 'express'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    controller.handle(httpRequest)
      .then(httpResponse => {
        if (httpResponse.statusCode === 200) {
          res.status(httpResponse.statusCode).json(httpResponse.body)
        } else {
          res.status(httpResponse.statusCode).json({
            error: httpResponse.body.message
          })
        }
      })
      .catch(error => {
        next(error)
      })
  }
}
