export interface CreateBookInput {
  title: string
  author: string
  isbn: string
  categoryId: string
  totalCopies: number
}

export interface UpdateBookInput {
  title?: string
  author?: string
  description?: string | null
  coverImageUrl?: string | null
  totalCopies?: number
  availableCopies?: number
  categoryId?: string
}
