// src/utils/slug.ts

/**
 * Bóc tách ID số từ chuỗi slug-id (VD: "one-piece-21" -> 21, "21" -> 21)
 * Trả về null nếu không tìm thấy ID hợp lệ.
 */
export const extractIdFromSlug = (param?: string): number | null => {
  if (!param) return null;

  // Nếu bản thân param đã là chuỗi số nguyên thuần ("21")
  if (/^\d+$/.test(param)) {
    return Number(param);
  }

  // Khớp với số đứng ngay sau dấu gạch nối cuối cùng ("test-lan-hain-21" -> 21)
  const match = param.match(/-(\d+)$/);
  if (match && match[1]) {
    return Number(match[1]);
  }

  return null;
};

/**
 * Hàm hỗ trợ tạo URL chi tiết truyện chuẩn format
 */
export const buildComicUrl = (slug?: string, id?: number | string): string => {
  const safeSlug = slug || "truyen";
  return `/comic/${safeSlug}-${id}`;
};
