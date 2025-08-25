import path from 'path';
import { fileURLToPath } from 'url';

export function parseNumber(value: string): number | null {
  if (!value || value === '-') return null;
  return Number(value.replace(',', '.'));
}

export function rootPath(relativePath: string) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, '../../', relativePath);
}

export function getTodayDate(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function parseDate(value: string | undefined | null): string | null {
  if (!value || value.trim() === '' || value === '-') return null;
  return value;
}

export function formatDateForSheets(d: any): string {
  if (!d) return '';
  if (d instanceof Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy}`; // dd.MM.yyyy
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [yyyy, mm, dd] = d.split('-');
    return `${dd}.${mm}.${yyyy}`;
  }
  return String(d);
}
