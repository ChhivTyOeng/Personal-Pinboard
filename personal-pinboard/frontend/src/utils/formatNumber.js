export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  const n = Number(num);
  if (isNaN(n)) return '0';

  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return n.toString();
}
