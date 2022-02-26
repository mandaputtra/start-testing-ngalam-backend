import dayjs from 'dayjs'
import { UserOTP, Response } from './types'

export const users: UserOTP[] = [
  { phoneNumber: '6281212', lastSentAt: null, otp: null  },
]

export function getUserByPhoneNumber(phoneNumber: string) {
  return users.filter(u => u.phoneNumber === phoneNumber)[0]
}

function generateOtp(): string {
  let otp = ''
  for (let i = 0; i < 4; i++) {
    const randomNum = Math.floor(Math.random() * (9 - 1 + 1))
    otp += randomNum.toString()
  }
  return otp
}

export function isNotValidInterval(user: UserOTP, date: Date): boolean {
  if (user.lastSentAt) {
    // check interval
    const diff = dayjs(new Date(user.lastSentAt)).diff(date, 's')
    if (diff > -60) {
      return true
    }
  }
  return false
}

export function sendOtp(phoneNumber: string): Response {
  // Side effect - get from database
  const user =  getUserByPhoneNumber(phoneNumber)
  // functional core logic validation
  if (isNotValidInterval(user, new Date())) {
    return { message: 'Fail to send OTP! Request again after 1 minute!'}
  }
  // Side effect - update to database
  user.otp = generateOtp()
  user.lastSentAt = new Date().toISOString()
  return { message: 'Success send OTP!' }
}
