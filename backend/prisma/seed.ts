import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PLATFORM_MARGIN_RATE = 0.05;

async function main() {
  console.log('🌱 Seeding MUJMart database...\n');

  // Clean up
  await prisma.dispute.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Campus Admin',
      email: 'admin@muj.edu.in',
      password: adminPassword,
      alias: 'MUJAdmin',
      role: 'admin',
      repScore: 5.0,
      dealCount: 0,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@muj.edu.in',
      password: studentPassword,
      alias: 'TechGuru42',
      repScore: 4.8,
      dealCount: 12,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Priya Verma',
      email: 'priya.verma@muj.edu.in',
      password: studentPassword,
      alias: 'BookWorm99',
      repScore: 4.5,
      dealCount: 8,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: 'Arjun Singh',
      email: 'arjun.singh@muj.edu.in',
      password: studentPassword,
      alias: 'CycleRider77',
      repScore: 4.6,
      dealCount: 5,
    },
  });

  const student4 = await prisma.user.create({
    data: {
      name: 'Sneha Patel',
      email: 'sneha.patel@muj.edu.in',
      password: studentPassword,
      alias: 'ScreenDeals',
      repScore: 5.0,
      dealCount: 2,
    },
  });

  console.log('✅ Users created:', [admin, student1, student2, student3, student4].map(u => u.alias).join(', '));

  // ─── Listings ─────────────────────────────────
  const expiresIn7Days = new Date();
  expiresIn7Days.setDate(expiresIn7Days.getDate() + 7);

  const listingsData = [
    {
      title: 'Sony WH-1000XM4 Headphones',
      description: 'Barely used Sony WH-1000XM4 with noise cancelling. All accessories included — original box, cables, and carry case. Works perfectly.',
      price: 12500,
      type: 'sell',
      category: 'Electronics',
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop',
      ]),
      sellerId: student1.id,
    },
    {
      title: 'Engineering Mathematics Textbook',
      description: 'B.S. Grewal Higher Engineering Mathematics 44th edition. Some highlighting in first 3 chapters. Great condition overall.',
      price: 350,
      type: 'resale',
      category: 'Books',
      condition: 'Fair',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&fit=crop',
      ]),
      sellerId: student2.id,
    },
    {
      title: 'Study Desk + Chair Combo',
      description: 'Sturdy wooden study desk with adjustable ergonomic chair. Perfect for exam season. Available for ₹200/day. Minimum 3 days rental.',
      price: 200,
      type: 'rent',
      category: 'Furniture',
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&fit=crop',
      ]),
      sellerId: student3.id,
    },
    {
      title: 'Firefox Cycle 26 inch',
      description: 'Firefox Pro cycle, 21-speed gear, well maintained. Minor scratches on body from normal use. Comes with lock and pump.',
      price: 4500,
      type: 'sell',
      category: 'Cycles',
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&fit=crop',
      ]),
      sellerId: student3.id,
    },
    {
      title: 'Samsung Monitor 24" FHD',
      description: 'Brand new Samsung S24F350 24-inch Full HD monitor. Still in sealed box with warranty card. HDMI & VGA ports included.',
      price: 8900,
      type: 'sell',
      category: 'Electronics',
      condition: 'New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&fit=crop',
        'https://images.unsplash.com/photo-1593640408182-31c228b9b7e9?w=800&fit=crop',
      ]),
      sellerId: student4.id,
    },
    {
      title: 'Arduino Uno Starter Kit',
      description: 'Complete Arduino Uno R3 starter kit — sensors, breadboard, jumper wires, resistors, LEDs, servo motor. Perfect for mini-projects.',
      price: 1200,
      type: 'sell',
      category: 'Electronics',
      condition: 'New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&fit=crop',
      ]),
      sellerId: student1.id,
    },
    {
      title: 'Room Fairy Lights (10m)',
      description: 'LED warm white fairy lights, 10 meters. Works perfectly, just redecorated my room. Free to a good home. Pick up from D Block.',
      price: 0,
      type: 'free',
      category: 'Room Essentials',
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&fit=crop',
      ]),
      sellerId: student2.id,
    },
    {
      title: 'Data Structures & Algorithms - CLRS',
      description: 'Introduction to Algorithms (CLRS) 3rd edition. Light notes in pencil, fully erasable. Essential for placements!',
      price: 650,
      type: 'resale',
      category: 'Books',
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop',
      ]),
      sellerId: student1.id,
    },
    {
      title: 'HP EliteBook Laptop Bag',
      description: '15.6 inch laptop bag, HP branded, padded compartments. Minor wear on straps. Excellent protection for any laptop.',
      price: 400,
      type: 'sell',
      category: 'Electronics',
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&fit=crop',
      ]),
      sellerId: student4.id,
    },
    {
      title: 'Mini Refrigerator 50L',
      description: 'Single door mini fridge, 50L. Works perfectly. Leaving campus this semester. Pick up only from Room A-218.',
      price: 3200,
      type: 'sell',
      category: 'Room Essentials',
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&fit=crop',
      ]),
      sellerId: student3.id,
    },
    {
      title: 'Cricket Kit (Complete)',
      description: 'Full cricket kit: bat, helmet, pads, gloves, and bag. Used for 2 seasons but in great shape. Ideal for hostel tournaments.',
      price: 2800,
      type: 'sell',
      category: 'Sports',
      condition: 'Good',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&fit=crop',
      ]),
      sellerId: student2.id,
    },
    {
      title: 'Yoga Mat + Resistance Bands Set',
      description: 'Premium 6mm yoga mat (never used) + set of 5 resistance bands with handles. Sealed packaging on the bands.',
      price: 0,
      type: 'free',
      category: 'Sports',
      condition: 'New',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&fit=crop',
      ]),
      sellerId: student1.id,
    },
  ];

  const listings = await Promise.all(
    listingsData.map((data) =>
      prisma.listing.create({ data: { ...data, expiresAt: expiresIn7Days } })
    )
  );

  console.log(`✅ ${listings.length} listings created`);

  // ─── Sample Thread + Messages ──────────────────
  const thread = await prisma.thread.create({
    data: {
      listingId: listings[0].id,
      buyerId: student2.id,
      sellerId: student1.id,
      status: 'open',
    },
  });

  await prisma.message.createMany({
    data: [
      {
        threadId: thread.id,
        senderId: student2.id,
        content: 'Hi! Is this still available? Would you take 11,000 for it?',
        isFiltered: false,
      },
      {
        threadId: thread.id,
        senderId: student1.id,
        content: 'Yes it\'s available! I can do 11,500 since it includes all accessories.',
        isFiltered: false,
      },
      {
        threadId: thread.id,
        senderId: student2.id,
        content: 'Deal at 11,500! When can we meet?',
        isFiltered: false,
      },
    ],
  });

  console.log('✅ Sample thread + messages created');

  // ─── Sample Transaction ────────────────────────
  const txnAmount = 8900;
  await prisma.transaction.create({
    data: {
      listingId: listings[4].id,
      buyerId: student1.id,
      sellerId: student4.id,
      amount: txnAmount,
      platformMargin: txnAmount * PLATFORM_MARGIN_RATE,
      status: 'completed',
    },
  });

  console.log('✅ Sample transaction created');

  // ─── Sample Dispute ────────────────────────────
  await prisma.dispute.create({
    data: {
      threadId: thread.id,
      reporterId: student2.id,
      reason: 'Item condition does not match description',
      status: 'open',
    },
  });

  console.log('✅ Sample dispute created');

  console.log('\n🎉 Seeding complete!\n');
  console.log('Demo credentials:');
  console.log('  Admin:   admin@muj.edu.in  / admin123');
  console.log('  Student: rohan.sharma@muj.edu.in / student123');
  console.log('  Student: priya.verma@muj.edu.in / student123\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
