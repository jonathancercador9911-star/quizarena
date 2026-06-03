// Sin caracteres ambiguos: 0/O, 1/I/L
const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateRoomCode(): string {
  return Array.from(
    { length: 6 },
    () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
  ).join("");
}
