
import { format, isToday, isYesterday, isTomorrow, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, "EEEE d 'de' MMMM", { locale: es });
};

export const formatShortDate = (date: Date): string => {
  return format(date, "d MMM", { locale: es });
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}h`;
};

export const formatFullDateTime = (date: Date, timeString: string): string => {
  return `${formatDate(date)} a las ${formatTime(timeString)}`;
};

export const getRelativeDay = (date: Date): string => {
  if (isToday(date)) {
    return 'Hoy';
  }
  if (isTomorrow(date)) {
    return 'Mañana';
  }
  if (isYesterday(date)) {
    return 'Ayer';
  }
  
  return format(date, "EEEE d 'de' MMMM", { locale: es });
};

export const getRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
};

export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM', { locale: es });
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
