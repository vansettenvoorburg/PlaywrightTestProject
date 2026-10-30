import { createHmac } from 'node:crypto';

const TOTP_PERIOD_MS = 30_000;
const TOTP_DIGITS = 6;
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** RFC 6238 (SHA1, 6 digits, 30s period), as expected by the site. */
export function generateTotp(secret: string, timeMs: number) {
  const secretAsBytes = convertSecretToBytes(secret);
  const timeStepAsBytes = convertTimeToTimeStepBytes(timeMs);
  const hmac = mixSecretWithTimeStep(secretAsBytes, timeStepAsBytes);
  const number = pickNumberFromHmac(hmac);
  return keepLastSixDigits(number);
}

export function msUntilTotpExpires(timeMs: number) {
  return TOTP_PERIOD_MS - (timeMs % TOTP_PERIOD_MS);
}

function convertSecretToBytes(secret: string) {
  const secretWithoutPadding = secret.replace(/=+$/, '').toUpperCase();
  const secretAsBits = [...secretWithoutPadding]
    .map((char) => BASE32_ALPHABET.indexOf(char).toString(2).padStart(5, '0'))
    .join('');
  return Buffer.from(secretAsBits.match(/.{8}/g)!.map((byte) => parseInt(byte, 2)));
}

function convertTimeToTimeStepBytes(timeMs: number) {
  const timeStepNumber = Math.floor(timeMs / TOTP_PERIOD_MS);
  const timeStepAsBytes = Buffer.alloc(8);
  timeStepAsBytes.writeBigUInt64BE(BigInt(timeStepNumber));
  return timeStepAsBytes;
}

function mixSecretWithTimeStep(secretAsBytes: Buffer, timeStepAsBytes: Buffer) {
  return createHmac('sha1', secretAsBytes).update(timeStepAsBytes).digest();
}

function pickNumberFromHmac(hmac: Buffer) {
  const startPosition = hmac[hmac.length - 1] & 0x0f;
  return hmac.readUInt32BE(startPosition) & 0x7fffffff;
}

function keepLastSixDigits(number: number) {
  const lastSixDigits = number % 10 ** TOTP_DIGITS;
  return lastSixDigits.toString().padStart(TOTP_DIGITS, '0');
}
