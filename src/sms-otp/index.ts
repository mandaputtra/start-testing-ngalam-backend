import dayjs from 'dayjs'

// this interface are 
interface UserOTP {
  phoneNumber: string;
  lastSendAt: string | null;
  counter: number;
}

export enum SendOTPMessageEnum {
  SUCCESS = 'Success send OTP!',
  FAIL_INTERVAL = 'Failed to send otp, interval too close',
  FAIL_TOO_MANY_REQUEST = 'Max 10 request reached, try again 6 hours later',
  FAIL_NUMBER_FORMAT = 'Please use country code format eg: 62xxxxxxx',
  FAIL_NON_EXIST_NUMBER = 'Number doesn\'t exist!',
}


export const users: UserOTP[] = [
  { phoneNumber: '6282221222121', lastSendAt: null, counter: 0 },
  { phoneNumber: '6282221222123', lastSendAt: new Date().toISOString(), counter: 10 },
  { phoneNumber: '6282221222124', lastSendAt: new Date().toISOString(), counter: 4 }
]

/*
* Pretend this are from db lol
*
*/
function getUserWithPhoneNumber(phoneNumber: string): UserOTP | undefined {
  return users.filter(u => u.phoneNumber === phoneNumber)[0]
}


function isNumberFormatCorrect(phoneNumber: string): boolean {
  const regex = /\b['62']{2}/gs;
  const match = phoneNumber.match(regex)
  if (!match) {
    return false
  }
  return true
}

/*
* Lest pretend this are used on your routes, the problem we are solving are :
* 1. User need a way to login with otp
* app.post('/send-otp', sendOtp)
*/
export function sendOtp(phoneNumber: string, thisDate: Date): SendOTPMessageEnum {

  if (!isNumberFormatCorrect(phoneNumber)) { 
    return SendOTPMessageEnum.FAIL_NUMBER_FORMAT
  }

  const userOtp = getUserWithPhoneNumber(phoneNumber)
  if (!userOtp) {
    return SendOTPMessageEnum.FAIL_NON_EXIST_NUMBER
  }

  if (userOtp.lastSendAt) {
    const diff = dayjs(userOtp.lastSendAt).diff(thisDate, 's')

    if (diff >= -60) {
      return SendOTPMessageEnum.FAIL_INTERVAL
    }

    if (userOtp.counter === 10 && diff >= -26100) {
      return SendOTPMessageEnum.FAIL_TOO_MANY_REQUEST
    }
  }

  return SendOTPMessageEnum.SUCCESS
}
