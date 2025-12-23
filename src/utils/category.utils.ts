// components/category/category.utils.ts
export const removeVietnameseTones = (str = "") => {
  if (!str) return "";
  try {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  } catch {
    return str
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }
};

export const normalize = (s = "") =>
  removeVietnameseTones(s).toLowerCase().trim();
