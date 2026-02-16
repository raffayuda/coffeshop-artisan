import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 9).toUpperCase()
  return `TRX-${timestamp}-${random}`
}

export function generateQRCode(orderId: string): string {
  // Simple QR code data - in production, use a proper QR code library
  return Buffer.from(orderId).toString('base64')
}

export function calculateEstimatedTime(itemCount: number): number {
  // Base time 5 minutes + 2 minutes per item
  return 5 + (itemCount * 2)
}

export function calculateTax(subtotal: number): number {
  // 10% tax
  return Math.round(subtotal * 0.1)
}

export function calculateLoyaltyPoints(total: number): number {
  // 1 point per 10000 rupiah
  return Math.floor(total / 10000)
}
