let counter = 0;

export function uniqueEmail() {
  return `user-${Date.now()}-${counter++}@example.com`;
}

export function uniquePassword() {
  return `Pw!${Date.now()}aB`;
}
