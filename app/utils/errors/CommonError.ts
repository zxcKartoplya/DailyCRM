export class CommonError extends Error {
  public code: number
  public url?: string
  public data?: unknown

  constructor(message: string, url?: string, data?: unknown) {
    super(message)

    // For ES5 instanceOf start working
    this.name = 'CommonError'
    Object.setPrototypeOf(this, CommonError.prototype)

    if (url) {
      this.url = url
    }

    if (data) {
      this.data = data
    }
  }
}
