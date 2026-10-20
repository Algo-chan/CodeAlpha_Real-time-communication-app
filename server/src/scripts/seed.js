import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { Room } from '../models/Room.js'
import config from '../config/env.js'

async function seed() {
  console.log(`[Seed] Connecting to MongoDB: ${config.MONGO_URI}`)
  try {
    await mongoose.connect(config.MONGO_URI)
  } catch (err) {
    console.error(`[Seed Error] Could not connect to MongoDB: ${err.message}`)
    process.exit(1)
  }

  console.log('[Seed] Clearing existing demo users and rooms...')
  await User.deleteMany({ email: { $in: ['alex@example.com', 'sarah@example.com'] } })
  await Room.deleteMany({ shortId: { $in: ['des-ignr-evw', 'str-ateg-y26'] } })

  console.log('[Seed] Creating demo users...')
  const passwordHash = await bcrypt.hash('password123', 12)

  const alex = new User({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    password: passwordHash,
  })
  await alex.save()

  const sarah = new User({
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    password: passwordHash,
  })
  await sarah.save()

  console.log('[Seed] Creating demo rooms...')
  const designRoom = new Room({
    name: 'Weekly Design Review',
    shortId: 'des-ignr-evw',
    createdBy: alex._id,
    hostName: alex.name,
    hasPassword: false,
    lastActivity: new Date(),
  })
  await designRoom.save()

  const strategyPassword = await bcrypt.hash('secret2026', 10)
  const strategyRoom = new Room({
    name: 'Executive Strategy & Planning',
    shortId: 'str-ateg-y26',
    createdBy: sarah._id,
    hostName: sarah.name,
    password: strategyPassword,
    hasPassword: true,
    lastActivity: new Date(),
  })
  await strategyRoom.save()

  console.log('--------------------------------------------------')
  console.log('✅ CollabRoom Demo Seed Completed Successfully!')
  console.log('--------------------------------------------------')
  console.log('Demo Credentials:')
  console.log('1. Email: alex@example.com    | Password: password123')
  console.log('2. Email: sarah@example.com   | Password: password123')
  console.log('')
  console.log('Demo Rooms Created:')
  console.log('1. des-ignr-evw  ("Weekly Design Review" - No password)')
  console.log('2. str-ateg-y26  ("Executive Strategy & Planning" - Password: secret2026)')
  console.log('--------------------------------------------------')

  await mongoose.disconnect()
  process.exit(0)
}

seed()
