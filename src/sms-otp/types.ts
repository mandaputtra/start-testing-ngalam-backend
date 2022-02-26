export interface UserOTP {
  phoneNumber: string;
  lastSentAt: string | null;
  otp: string | null
}

export interface Response {
  message: string;
}
