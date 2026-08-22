export type ApiResponse<T> = {
  data: T,
  error?: {
    message: string
    code?: string
  },
  meta?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
