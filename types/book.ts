import { Category } from './category'

/** Book without relations */
export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  description?: string | null
  coverImageUrl?: string | null
  totalCopies: number
  availableCopies: number
  categoryId: string
}

/** Book with category */
export interface BookWithCategory extends Book {
  category: Category
}

/** Use for book cards in homepage */
export interface BookListItem {
  id: string
  title: string
  author: string
  coverImageUrl?: string | null
  availableCopies: number
  category: {
    name: string
    slug: string
  }
}
