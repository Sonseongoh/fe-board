const BANNED_WORDS = ["캄보디아", "프놈펜", "불법체류", "텔레그램"];

export function findBannedWord(text: string): string | null {
  return BANNED_WORDS.find((word) => text.includes(word)) ?? null;
}
