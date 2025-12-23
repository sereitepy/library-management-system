import { TransactionStatus } from './enums'
import { Book } from './book'
import { UserSummary } from './user'

/** Core transaction */
export interface BorrowingTransaction {
  id: string
  status: TransactionStatus
  requestDate: Date
  pickupDeadline: Date
  borrowedDate?: Date | null
  dueDate?: Date | null
  returnedDate?: Date | null
}

/** User view (with book) */
export interface UserBorrow extends BorrowingTransaction {
  book: Book
}

/** Admin view (with user + book) */
export interface AdminBorrow extends BorrowingTransaction {
  user: UserSummary
  book: Book
}
