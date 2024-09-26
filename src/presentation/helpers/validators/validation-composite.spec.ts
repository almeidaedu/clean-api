import { ValidationComposite } from './validation-composite'
import type { Validation } from './validation'
import { MissingParamError } from '../../errors'

// class ValidationStub implements Validation {
//   validate (input: any): Error | undefined {
//     return undefined
//   }
// }

describe('ValidationComposite', () => {
  test('should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error | undefined {
        return new MissingParamError('field')
      }
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
