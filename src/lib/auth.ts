// 填写码管理

const FILL_CODE_KEY = 'desci_fill_code'

export function getFillCode(): string | null {
  return sessionStorage.getItem(FILL_CODE_KEY)
}

export function setFillCode(code: string): void {
  sessionStorage.setItem(FILL_CODE_KEY, code)
}

export function clearFillCode(): void {
  sessionStorage.removeItem(FILL_CODE_KEY)
}
