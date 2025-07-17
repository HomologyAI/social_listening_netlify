export function sanitizeForId(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-') // 保留中文、字母、数字，其他字符替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-|-$/g, ''); // 去掉开头和结尾的连字符
} 