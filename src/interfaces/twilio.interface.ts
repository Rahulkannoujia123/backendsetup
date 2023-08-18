// src/interfaces/twilio.interface.ts

export interface ITwilioResponse {
    sid: string;
    serviceSid: string;
    accountSid: string;
    status: string;
    valid: boolean;
    to: string;
  }