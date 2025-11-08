import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Nếu là hôm nay: chỉ hiển thị giờ
    if (isToday(date)) {
        return format(date, 'HH:mm', { locale: vi });
    }

    // Nếu là hôm qua
    if (isYesterday(date)) {
        return `Hôm qua ${format(date, 'HH:mm', { locale: vi })}`;
    }

    // Nếu trong tuần này
    if (isThisWeek(date)) {
        return format(date, 'EEEE HH:mm', { locale: vi });
    }

    // Nếu trong năm nay
    if (isThisYear(date)) {
        return format(date, 'dd/MM HH:mm', { locale: vi });
    }

    // Nếu là năm trước
    return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
};

export const formatConversationTime = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) {
        return format(date, 'HH:mm', { locale: vi });
    }

    if (isYesterday(date)) {
        return 'Hôm qua';
    }

    if (isThisWeek(date)) {
        return format(date, 'EEEE', { locale: vi });
    }

    if (isThisYear(date)) {
        return format(date, 'dd/MM', { locale: vi });
    }

    return format(date, 'dd/MM/yyyy', { locale: vi });
};
