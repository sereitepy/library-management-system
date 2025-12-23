export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
  description?: string
}
