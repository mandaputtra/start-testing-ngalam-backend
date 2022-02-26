import dayjs from 'dayjs'
import { describe, it, expect } from 'vitest'
import { sendOtp, SendOTPMessageEnum } from './'

describe("sms otp module", () => {

  it('success send otp to a user.', () => {
    const sent = sendOtp('6282221222121', new Date())
    expect(sent).toBe(SendOTPMessageEnum.SUCCESS)
  })

  it('fail to send otp, number does not start with country code', () => {
    const sent = sendOtp('082221222121', new Date())
    expect(sent).toBe(SendOTPMessageEnum.FAIL_NUMBER_FORMAT)
  })

  it('fail to send otp, because number not registered on db', () => {
    const sent = sendOtp('628222123123', new Date())
    expect(sent).toBe(SendOTPMessageEnum.FAIL_NON_EXIST_NUMBER)
  })

  it('fail to send otp, maximum otp request reach (10)', () => {
    const after4hours = dayjs().add(4, 'h').toDate()
    const sent = sendOtp('6282221222123', after4hours)
    expect(sent).toBe(SendOTPMessageEnum.FAIL_TOO_MANY_REQUEST)
  })

  it('success to send otp, after 6 hours period end', () => {
    const after6Hours = dayjs().add(6, 'h').toDate()
    const sent = sendOtp('6282221222123', after6Hours)
    expect(sent).toBe(SendOTPMessageEnum.SUCCESS)
  })

  it('fail to send otp, send interval too close (1 minute)', () => {
    const after10seconds = dayjs().add(30, 's').toDate()
    const sent = sendOtp('6282221222124', after10seconds)
    expect(sent).toBe(SendOTPMessageEnum.FAIL_INTERVAL)
  })

  it('fail to send otp, send interval too close (1 minute)', () => {
    const after2minutes = dayjs().add(120, 's').toDate()
    const sent = sendOtp('6282221222124', after2minutes)
    expect(sent).toBe(SendOTPMessageEnum.SUCCESS)
  })
}) 
