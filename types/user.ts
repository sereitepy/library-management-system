import { UserRole } from './enums'

/** User info */
export interface UserSummary {
  id: string
  name: string
  email: string
  role: UserRole
}

/** Full profile */
export interface UserProfile extends UserSummary {
  createdAt: Date
  updatedAt: Date
}

/** Stats response */
export interface UserStats {
  totalBorrows: number
  activeBorrows: number
}
