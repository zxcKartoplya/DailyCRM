export class NotFoundError extends Error {
  public code: number
  public url?: string
  public data?: unknown

  constructor(message: string, url?: string, data?: unknown) {
    super(message)

    // For ES5 instanceOf start working
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)

    if (url) {
      this.url = url
    }

    if (data) {
      this.data = data
    }
  }
}
