// src/utils/formData.ts

/**
 * Chuyển đổi một plain object thành instance FormData.
 * Hỗ trợ các trường hợp: File/Blob, Date, Mảng nguyên thủy, Object lồng nhau, bỏ qua null/undefined.
 */
export const toFormData = (
  data: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey?: string,
): FormData => {
  if (data === null || data === undefined) {
    return formData;
  }

  Object.entries(data).forEach(([key, value]) => {
    // Bỏ qua giá trị null hoặc undefined
    if (value === null || value === undefined) {
      return;
    }

    // Xử lý key lồng nhau: nếu có parentKey thì định dạng là parentKey[subKey] hoặc parentKey.subKey
    // Đối với Spring Boot model binding: parentKey.childKey hoặc parentKey[index]
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
    } else if (value instanceof Date) {
      formData.append(formKey, value.toISOString());
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item === null || item === undefined) return;

        // Nếu phần tử trong mảng là File/Blob hoặc kiểu nguyên thủy:
        // Lặp lại cùng key (vd: categoryIds=1&categoryIds=2) để Spring Boot tự map vào List<Long>
        if (
          item instanceof File ||
          item instanceof Blob ||
          typeof item !== "object"
        ) {
          formData.append(formKey, item);
        } else {
          // Nếu mảng chứa object phức tạp (vd: items[0].name)
          toFormData(item, formData, `${formKey}[${index}]`);
        }
      });
    } else if (typeof value === "object") {
      // Đệ quy với object lồng nhau
      toFormData(value, formData, formKey);
    } else {
      formData.append(formKey, String(value));
    }
  });

  return formData;
};

export default toFormData;
