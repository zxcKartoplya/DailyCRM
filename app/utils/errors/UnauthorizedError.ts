export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Access denied!')

    // For ES5 instanceOf start working
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}
