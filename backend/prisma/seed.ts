import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')

    // 1. Create Admin User
    const admin = await prisma.user.create({
        data: {
            email: 'admin@tiffinstash.com',
            password: 'hashedpwd_mock_123', // In real app, hash this
            name: 'System Admin',
            role: 'ADMIN'
        }
    })
    console.log(`Created admin user: ${admin.email}`)

    // 2. Create Stores
    const storeA = await prisma.store.create({
        data: { name: 'Store A - Downtown', location: 'Toronto Core' }
    })
    const storeB = await prisma.store.create({
        data: { name: 'Store B - East End', location: 'Scarborough' }
    })

    // 3. Create Tags & Meal Items
    const tagSpicy = await prisma.tag.create({ data: { name: 'Spicy' } })
    const tagVeg = await prisma.tag.create({ data: { name: 'Vegetarian' } })

    const item1 = await prisma.mealItem.create({
        data: {
            name: 'Butter Chicken & Rice',
            category: 'Main',
            cost: 5.50,
            tags: { create: [{ tag: { connect: { id: tagSpicy.id } } }] }
        }
    })

    // 4. Create Meal Plans
    const planStandard = await prisma.mealPlan.create({
        data: {
            name: 'Standard Weekly (5 Days)',
            storeId: storeA.id,
            price: 65.00,
            tags: { create: [{ tag: { connect: { id: tagVeg.id } } }] }
        }
    })

    // 5. Create Customers
    const customer1 = await prisma.customer.create({
        data: {
            name: 'Alice Smith',
            email: 'alice@example.com',
            phone: '555-0100',
            address: '123 Maple St',
            unitApt: '4B'
        }
    })

    const customer2 = await prisma.customer.create({
        data: {
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '555-0101',
            address: '456 Oak Ave'
        }
    })

    // 6. Create Shopify Orders
    const order1 = await prisma.order.create({
        data: {
            orderNumber: '#40921',
            customerId: customer1.id,
            total: 65.00,
            status: 'APPROVED',
            itemsData: JSON.stringify([{ name: 'Weekly Standard 5-Day', price: 65.00 }])
        }
    })

    // 7. Create Subscriptions
    const sub1 = await prisma.subscription.create({
        data: {
            customerId: customer1.id,
            planId: planStandard.id,
            storeId: storeA.id,
            status: 'ACTIVE',
            startDate: new Date(),
            deliveryDays: 'Mon,Tue,Wed,Thu,Fri',
            mealsRemaining: 15
        }
    })

    // 8. Create Zones & Drivers
    const zoneDowntown = await prisma.zone.create({
        data: { name: 'Downtown Core', postalCodes: 'M5V,M4Y,M5A', color: '#DE5200' }
    })

    const driver1 = await prisma.driver.create({
        data: { name: 'John Doe', phone: '555-9001', vehicle: 'White Van' }
    })

    // 9. Create Routes & Deliveries
    const route1 = await prisma.route.create({
        data: {
            date: new Date(),
            zoneId: zoneDowntown.id,
            driverId: driver1.id,
            status: 'ACTIVE'
        }
    })

    await prisma.delivery.create({
        data: {
            subscriptionId: sub1.id,
            date: new Date(),
            status: 'PLANNED',
            routeId: route1.id,
            zoneId: zoneDowntown.id,
            driverId: driver1.id
        }
    })

    console.log('Seed completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
