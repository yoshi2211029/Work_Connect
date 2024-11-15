import { format, getTime, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale'; // 日本語ロケールをインポート

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'yyyy-MM-dd HH:mm:ss';

  return date ? format(new Date(date), fm, { locale: ja }) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm, { locale: ja }) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ja, // 日本語ロケールを指定
      })
    : '';
}
