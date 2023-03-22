export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      'Then check-in can only be validated until 20 minutes of its creation ',
    )
  }
}
