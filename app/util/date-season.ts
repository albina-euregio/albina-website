export function currentSeasonYear() {
  const now = new Date();
  return now.getMonth() < 9 ? now.getFullYear() - 1 : now.getFullYear();
}

export function currentSeasonDate() {
  return new Date(currentSeasonYear(), 9, 1);
}
