export type ApiResponse<T, M = undefined> = {
  data: T
  error?: {
    message: string
    code?: string
  }
  meta?: M
}
