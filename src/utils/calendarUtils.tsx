export function generateMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const days = [];

  const startDay = firstDay.getDay(); // dia da semana

  // adicionar espaços vazios
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}
