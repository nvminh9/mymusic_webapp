import { useState, useEffect } from 'react';

/**
 * Hàm tiện ích kiểm tra khả năng cảm ứng của trình duyệt.
 * Dựa trên logic Feature Detection chuẩn.
 */
const hasTouchCapability = () => {
    if (typeof window === 'undefined') return false; // Tránh lỗi khi render phía server (SSR/Next.js)

    // Phương pháp hiện đại được ưu tiên: Kiểm tra số điểm chạm tối đa
    if ('maxTouchPoints' in navigator) {
        return navigator.maxTouchPoints > 0;
    }

    // Phương án dự phòng sử dụng Media Query CSS trong JS cho khả năng chạm "coarse" (ngón tay)
    const mQ = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mQ && mQ.media === '(pointer:coarse)') {
        return !!mQ.matches;
    }

    // Phương án dự phòng cũ hơn (kiểm tra thuộc tính orientation chỉ có trên mobile)
    return 'orientation' in window;
};

/**
 * Custom Hook React để phát hiện trạng thái Mobile dựa trên cả kích thước màn hình và khả năng cảm ứng.
 */
export const useIsMobile = (breakpoint = 768) => {
    // Hàm tính toán trạng thái hiện tại
    const calculateIsMobile = () => {
        // Chúng ta định nghĩa "mobile" là thiết bị có màn hình nhỏ HƠN breakpoint
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const isSmallScreen = screenWidth < breakpoint;

        // Bạn có thể chọn 1 trong 2 logic sau tùy vào định nghĩa "mobile" của bạn:

        // LOGIC A (Khuyên dùng): Chỉ cần màn hình nhỏ là đủ (Responsive Web Design chuẩn)
        return isSmallScreen;

        // LOGIC B (Chặt chẽ hơn): Cần màn hình nhỏ VÀ có khả năng cảm ứng
        // return isSmallScreen && hasTouchCapability();
    };

    const [isMobile, setIsMobile] = useState(calculateIsMobile());

    useEffect(() => {
        const handleResizeOrChange = () => {
            setIsMobile(calculateIsMobile());
        };

        // Lắng nghe sự kiện resize để cập nhật UI khi người dùng thay đổi kích thước cửa sổ
        window.addEventListener('resize', handleResizeOrChange);

        // Thêm các lắng nghe sự kiện khác nếu cần (ví dụ: thay đổi orientation)

        return () => {
            window.removeEventListener('resize', handleResizeOrChange);
        };
    }, [breakpoint]); // Dependency array

    return isMobile;
};
