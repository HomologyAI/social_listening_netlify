export const sanitizeForId = (text) => {
  if (text === null || typeof text === "undefined" || text.toString().trim() === "") {
    // Generate a more unique fallback ID if text is empty or invalid
    return "id-" + Date.now() + Math.random().toString(36).substring(2, 7);
  }
  return text.toString().toLowerCase()
    .replace(/\s+/g, "-")      // Replace spaces with hyphens
    // Allow Chinese characters (Unicode range \u4e00-\u9fa5), letters, numbers, and hyphens
    .replace(/[^a-z0-9-\u4e00-\u9fa5]/g, "") 
    .replace(/-+/g, "-")       // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, "");   // Remove leading or trailing hyphens
}; 