import { describe, it, expect } from 'vitest'
import { sendOtp, getUserByPhoneNumber, isNotValidInterval } from './'

describe("sms otp module", () => {
  const phoneNumber = '6281212'

  it('success send otp to a user.', () => {
    const response = sendOtp(phoneNumber)
    expect(response).toEqual({ message: 'Success send OTP!' })
  })
  
  it('fail to send otp, send interval too close', () => {
    const response = sendOtp(phoneNumber)
    expect(response).toEqual({ message: 'Fail to send OTP! Request again after 1 minute!' })
  })

  it('success to send otp, after more than 1 minute', () => {
    const notValid = isNotValidInterval({
      phoneNumber,
      lastSentAt: '2022-02-27 10:11',
      otp: '8981'
    }, new Date('2022-02-27 10:12:01'))
    expect(notValid).toBe(false)
  })

  it('fail to send otp, interval to close', () => {
    const notValid = isNotValidInterval({
      phoneNumber: '621233',
      lastSentAt: '2022-02-27 10:11:00',
      otp: '8981'
    }, new Date('2022-02-27 10:11:30'))
    expect(notValid).toBe(true)
  })

  it('fail to send otp, interval to close', () => {
    const notValid = isNotValidInterval({
      phoneNumber,
      lastSentAt: '2022-02-27 10:11:00',
      otp: '8981'
    }, new Date('2022-02-27 10:11:30'))
    expect(notValid).toBe(true)
  })

  it('can verify if the otp sent are 4 digits', () => {
    const user = getUserByPhoneNumber(phoneNumber)
    expect(user.otp.length).toBe(4)
    expect(user.lastSentAt).toBeTruthy()
  })

}) 
