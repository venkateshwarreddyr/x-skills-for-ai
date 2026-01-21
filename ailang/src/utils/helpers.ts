export function generateUUID(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(date: Date): string {
  return date.toISOString();
}