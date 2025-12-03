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

// Trả về dạng "Hoạt động 'thời gian' trước"
export const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    // Các khoảng thời gian tính bằng giây
    const intervals = {
        năm: 31536000,
        tháng: 2592000,
        tuần: 604800,
        ngày: 86400,
        giờ: 3600,
        phút: 60,
        giây: 1,
    };

    // Tìm khoảng thời gian phù hợp
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / secondsInUnit);

        if (interval >= 1) {
            return `Hoạt động ${interval} ${unit} trước`;
        }
    }

    return '';
    // return 'Hoạt động vừa xong';
};
