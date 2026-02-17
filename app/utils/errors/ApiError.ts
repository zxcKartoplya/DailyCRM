export class ApiError extends Error {
  public code: number
  public url?: string
  public data?: unknown

  constructor(message: string, code: number, url?: string, data?: unknown) {
    super(message)

    // For ES5 instanceOf start working
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)

    this.code = code

    if (url) {
      this.url = url
    }

    if (data) {
      this.data = data
    }
  }
}
