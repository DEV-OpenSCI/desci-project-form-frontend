// 填写码管理

const FILL_CODE_KEY = 'desci_fill_code'
const EXPIRE_TIME_KEY = 'desci_expire_time'

export function getFillCode(): string | null {
  return sessionStorage.getItem(FILL_CODE_KEY)
}

export function setFillCode(code: string): void {
  sessionStorage.setItem(FILL_CODE_KEY, code)
}

export function getExpireTime(): string | null {
  return sessionStorage.getItem(EXPIRE_TIME_KEY)
}

export function setExpireTime(time: string): void {
  sessionStorage.setItem(EXPIRE_TIME_KEY, time)
}

export function clearFillCode(): void {
  sessionStorage.removeItem(FILL_CODE_KEY)
  sessionStorage.removeItem(EXPIRE_TIME_KEY)
}
