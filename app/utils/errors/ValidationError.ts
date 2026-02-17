export class ValidationError extends Error {
  // TODO: backend forcely to fields Record<string, string[]>
  public fields: Record<string, string | string[]>

  constructor(message: string, fields: Record<string, string | string[]>) {
    super(message)

    // For ES5 instanceOf start working
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)

    this.fields = { ...fields }
  }
}
