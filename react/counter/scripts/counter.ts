// Counter skill implementation

let count = 0;

export function incr(): number {
  count += 1;
  return count;
}

export function decr(param: number = 1): number {
  count -= param;
  return count;
}

export function getCount(): number {
  return count;
}