import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

// Read products data
const productsData = JSON.parse(
  readFileSync(join(__dirname, '../app/data/products.json'), 'utf-8')
)

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coffeeshop.com' },
    update: {},
    create: {
      email: 'admin@coffeeshop.com',
      password: adminPassword,
      fullName: 'Admin User',
      phone: '081234567890',
      role: 'ADMIN',
      loyaltyPoint: 0
    }
  })
  console.log('✅ Admin user created:', admin.email)

  // Create barista users
  const baristaPassword = await bcrypt.hash('barista123', 10)
  const barista1 = await prisma.user.upsert({
    where: { email: 'barista1@coffeeshop.com' },
    update: {},
    create: {
      email: 'barista1@coffeeshop.com',
      password: baristaPassword,
      fullName: 'John Barista',
      phone: '081234567891',
      role: 'BARISTA',
      loyaltyPoint: 0
    }
  })

  const barista2 = await prisma.user.upsert({
    where: { email: 'barista2@coffeeshop.com' },
    update: {},
    create: {
      email: 'barista2@coffeeshop.com',
      password: baristaPassword,
      fullName: 'Jane Barista',
      phone: '081234567892',
      role: 'BARISTA',
      loyaltyPoint: 0
    }
  })
  console.log('✅ Barista users created')

  // Create sample customers
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customers = []
  for (let i = 1; i <= 5; i++) {
    const customer = await prisma.user.upsert({
      where: { email: `customer${i}@example.com` },
      update: {},
      create: {
        email: `customer${i}@example.com`,
        password: customerPassword,
        fullName: `Customer ${i}`,
        phone: `08123456789${10 + i}`,
        role: 'CUSTOMER',
        loyaltyPoint: Math.floor(Math.random() * 100)
      }
    })
    
    // Create user preferences
    await prisma.userPreference.upsert({
      where: { userId: customer.id },
      update: {},
      create: {
        userId: customer.id,
        sugarLevel: ['LESS', 'NORMAL', 'EXTRA'][Math.floor(Math.random() * 3)] as any,
        iceLevel: ['LESS', 'NORMAL', 'EXTRA'][Math.floor(Math.random() * 3)] as any
      }
    })

    customers.push(customer)
  }
  console.log('✅ Customer users created')

  // Create addresses for first 3 customers
  for (let i = 0; i < 3; i++) {
    await prisma.address.create({
      data: {
        userId: customers[i].id,
        label: 'Home',
        fullAddress: `Jl. Contoh No. ${i + 1}, Jakarta Selatan`,
        city: 'Jakarta Selatan',
        postalCode: `12${190 + i}`,
        recipientName: customers[i].fullName,
        recipientPhone: customers[i].phone!,
        isDefault: true
      }
    })
  }
  console.log('✅ Addresses created')

  // Create toppings
  const toppings = [
    { name: 'Pearl', price: 5000, isAvailable: true },
    { name: 'Pudding', price: 5000, isAvailable: true },
    { name: 'Jelly', price: 5000, isAvailable: true },
    { name: 'Cream Cheese', price: 7000, isAvailable: true },
    { name: 'Ice Cream', price: 10000, isAvailable: true },
    { name: 'Whipped Cream', price: 5000, isAvailable: true }
  ]

  const createdToppings = []
  for (const topping of toppings) {
    let created = await prisma.topping.findFirst({
      where: { name: topping.name }
    })
    
    if (!created) {
      created = await prisma.topping.create({
        data: topping
      })
    }
    
    createdToppings.push(created)
  }
  console.log('✅ Toppings created')

  // Create ingredients
  const ingredients = [
    { name: 'Coffee Beans', unit: 'KG', currentStock: 50, minStock: 10 },
    { name: 'Milk', unit: 'L', currentStock: 100, minStock: 20 },
    { name: 'Sugar', unit: 'KG', currentStock: 30, minStock: 5 },
    { name: 'Tea Leaves', unit: 'KG', currentStock: 20, minStock: 5 },
    { name: 'Chocolate Powder', unit: 'KG', currentStock: 15, minStock: 3 },
    { name: 'Vanilla Syrup', unit: 'L', currentStock: 10, minStock: 2 },
    { name: 'Caramel Syrup', unit: 'L', currentStock: 10, minStock: 2 },
    { name: 'Matcha Powder', unit: 'KG', currentStock: 5, minStock: 1 },
    { name: 'Ice', unit: 'KG', currentStock: 200, minStock: 50 }
  ]

  const createdIngredients = []
  for (const ingredient of ingredients) {
    let created = await prisma.ingredient.findFirst({
      where: { name: ingredient.name }
    })
    
    if (!created) {
      created = await prisma.ingredient.create({
        data: ingredient
      })
    }
    
    createdIngredients.push(created)
  }
  console.log('✅ Ingredients created')

  // Create menus from products.json
  const categoryMap: any = {
    'coffee': 'COFFEE',
    'non-coffee': 'NON_COFFEE',
    'snack': 'SNACK',
    'food': 'SNACK',
    'drinks': 'NON_COFFEE'
  }

  const createdMenus = []
  for (const product of productsData) {
    // Check if menu already exists
    const existing = await prisma.menu.findFirst({
      where: { name: product.name }
    })

    if (existing) {
      createdMenus.push(existing)
      continue
    }

    const menu = await prisma.menu.create({
      data: {
        name: product.name,
        description: product.description,
        category: categoryMap[product.category] || 'FOOD',
        image: product.image,
        isAvailable: true,
        prices: {
          create: [
            { size: 'SMALL', price: product.price },
            { size: 'MEDIUM', price: product.price + 5000 },
            { size: 'LARGE', price: product.price + 10000 }
          ]
        }
      }
    })

    // Link some ingredients to menus
    if (categoryMap[product.category] === 'COFFEE') {
      await prisma.menuIngredient.createMany({
        data: [
          { menuId: menu.id, ingredientId: createdIngredients[0].id, quantity: 0.02 }, // Coffee Beans
          { menuId: menu.id, ingredientId: createdIngredients[1].id, quantity: 0.15 }, // Milk
          { menuId: menu.id, ingredientId: createdIngredients[2].id, quantity: 0.01 }  // Sugar
        ]
      })
    }

    // Link some toppings to menus
    const randomToppings = createdToppings.slice(0, 3)
    await prisma.menuTopping.createMany({
      data: randomToppings.map(t => ({
        menuId: menu.id,
        toppingId: t.id
      }))
    })

    createdMenus.push(menu)
  }
  console.log(`✅ ${createdMenus.length} menus created`)

  // Create vouchers
  const now = new Date()
  const futureDate = new Date()
  futureDate.setMonth(futureDate.getMonth() + 3)

  const vouchers = [
    {
      code: 'WELCOME10',
      name: 'Welcome Discount',
      description: 'Get 10% off your first order',
      type: 'PERCENTAGE',
      value: 10,
      maxDiscount: 20000,
      quotaLimit: 100,
      quotaUsed: 0,
      validFrom: now,
      validTo: futureDate,
      isActive: true
    },
    {
      code: 'DISC20K',
      name: 'Discount 20K',
      description: 'Get Rp 20.000 discount',
      type: 'FIXED',
      value: 20000,
      maxDiscount: null,
      quotaLimit: 50,
      quotaUsed: 0,
      validFrom: now,
      validTo: futureDate,
      isActive: true
    },
    {
      code: 'FREESHIP',
      name: 'Free Delivery',
      description: 'Free delivery fee',
      type: 'FIXED',
      value: 10000,
      maxDiscount: null,
      quotaLimit: 30,
      quotaUsed: 0,
      validFrom: now,
      validTo: futureDate,
      isActive: true
    }
  ]

  for (const voucher of vouchers) {
    await prisma.voucher.upsert({
      where: { code: voucher.code },
      update: {},
      create: voucher
    })
  }
  console.log('✅ Vouchers created')

  // Create store settings
  await prisma.storeSetting.upsert({
    where: { key: 'store_name' },
    update: {},
    create: {
      key: 'store_name',
      value: 'Coffee Shop',
      type: 'string'
    }
  })

  await prisma.storeSetting.upsert({
    where: { key: 'store_address' },
    update: {},
    create: {
      key: 'store_address',
      value: 'Jl. Sudirman No. 123, Jakarta',
      type: 'string'
    }
  })

  await prisma.storeSetting.upsert({
    where: { key: 'store_phone' },
    update: {},
    create: {
      key: 'store_phone',
      value: '021-12345678',
      type: 'string'
    }
  })

  await prisma.storeSetting.upsert({
    where: { key: 'delivery_fee' },
    update: {},
    create: {
      key: 'delivery_fee',
      value: '10000',
      type: 'number'
    }
  })

  await prisma.storeSetting.upsert({
    where: { key: 'tax_percentage' },
    update: {},
    create: {
      key: 'tax_percentage',
      value: '10',
      type: 'number'
    }
  })

  console.log('✅ Store settings created')

  // Create operational hours
  const days = [
    { day: 'MONDAY', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { day: 'TUESDAY', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { day: 'WEDNESDAY', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { day: 'THURSDAY', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { day: 'FRIDAY', openTime: '08:00', closeTime: '23:00', isOpen: true },
    { day: 'SATURDAY', openTime: '09:00', closeTime: '23:00', isOpen: true },
    { day: 'SUNDAY', openTime: '09:00', closeTime: '21:00', isOpen: true }
  ]

  for (const dayData of days) {
    const existing = await prisma.operationalHour.findFirst({
      where: { day: dayData.day }
    })
    
    if (!existing) {
      await prisma.operationalHour.create({
        data: dayData
      })
    }
  }
  console.log('✅ Operational hours created')

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📝 Sample credentials:')
  console.log('Admin: admin@coffeeshop.com / admin123')
  console.log('Barista: barista1@coffeeshop.com / barista123')
  console.log('Customer: customer1@example.com / customer123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
