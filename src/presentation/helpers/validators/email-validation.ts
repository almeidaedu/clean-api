import { InvalidParamError } from '../../errors'
import type { EmailValidator } from '../../protocols/email-validator'
import type { Validation } from '../../protocols/validation'

type InputType = Record<string, string>

const isInputType = (input: unknown): input is InputType => {
  if (input !== null && typeof input === 'object') {
    return true
  }

  return false
}

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: unknown): Error | undefined {
    if (!isInputType(input)) {
      return new InvalidParamError(this.fieldName)
    }

    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
