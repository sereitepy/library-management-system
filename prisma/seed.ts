import { PrismaClient, Prisma } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: 'Fiction',
    slug: 'fiction',
    description: 'Fictional books',
  },
  {
    name: 'Non-Fiction',
    slug: 'non-fiction',
    description: 'Based on real events',
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Science & technology',
  },
  {
    name: 'History',
    slug: 'history',
    description: 'Historical books',
  },
  {
    name: 'Self Development',
    slug: 'self-development',
    description: 'Personal growth books',
  },
]

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Admin User',
    email: 'admin@library.com',
    password: 'hashed_admin_password',
    role: 'ADMIN',
  },
  {
    name: 'Normal User',
    email: 'user@library.com',
    password: 'hashed_user_password',
    role: 'USER',
  },
]

export async function main() {
  // Seed categories
  const categories = await Promise.all(
    categoryData.map(c => prisma.category.create({ data: c }))
  )

  const categoryMap = Object.fromEntries(categories.map(c => [c.slug, c]))

  // Seed users
  for (const u of userData) {
    await prisma.user.create({ data: u })
  }

  // Seed books
  await prisma.book.createMany({
    data: [
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        description: 'Dystopian novel',
        totalCopies: 3,
        availableCopies: 3,
        categoryId: categoryMap['fiction'].id,
      },
      {
        title: 'Animal Farm',
        author: 'George Orwell',
        isbn: '978-0451526342',
        description: 'Political satire',
        totalCopies: 2,
        availableCopies: 2,
        categoryId: categoryMap['fiction'].id,
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        isbn: '978-0062316110',
        description: 'Human history',
        totalCopies: 4,
        availableCopies: 4,
        categoryId: categoryMap['history'].id,
      },
      {
        title: 'Educated',
        author: 'Tara Westover',
        isbn: '978-0399590504',
        description: 'Memoir',
        totalCopies: 2,
        availableCopies: 2,
        categoryId: categoryMap['non-fiction'].id,
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0553380163',
        description: 'Cosmology explained',
        totalCopies: 3,
        availableCopies: 3,
        categoryId: categoryMap['science'].id,
      },
      {
        title: 'The Selfish Gene',
        author: 'Richard Dawkins',
        isbn: '978-0198788607',
        description: 'Evolutionary biology',
        totalCopies: 2,
        availableCopies: 2,
        categoryId: categoryMap['science'].id,
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '978-0735211292',
        description: 'Habit building',
        totalCopies: 5,
        availableCopies: 5,
        categoryId: categoryMap['self-development'].id,
      },
      {
        title: 'Deep Work',
        author: 'Cal Newport',
        isbn: '978-1455586691',
        description: 'Focused success',
        totalCopies: 3,
        availableCopies: 3,
        categoryId: categoryMap['self-development'].id,
      },
      {
        title: 'Guns, Germs, and Steel',
        author: 'Jared Diamond',
        isbn: '978-0393317558',
        description: 'Civilization development',
        totalCopies: 2,
        availableCopies: 2,
        categoryId: categoryMap['history'].id,
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        isbn: '978-0374533557',
        description: 'Psychology of decisions',
        totalCopies: 3,
        availableCopies: 3,
        categoryId: categoryMap['non-fiction'].id,
      },
    ],
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
