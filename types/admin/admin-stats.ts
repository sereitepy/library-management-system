export interface AdminStats {
  users: number
  books: number
  borrowed: number
}

export interface BorrowAnalyticsItem {
  status: string
  _count: number
}
