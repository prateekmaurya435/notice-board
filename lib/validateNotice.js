const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

// Roughly 3MB of base64 text, which corresponds to a couple MB of binary
// image data. Generous enough for a notice photo, small enough to keep
const MAX_IMAGE_LENGTH = 4_000_000;

/**
 
 * @param {object} body - raw req.body
 * @returns {{ errors: string[], data: object|null }}
 */
export function validateNotice(body) {
  const errors = [];

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const noticeBody = typeof body?.body === "string" ? body.body.trim() : "";
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const priority = typeof body?.priority === "string" ? body.priority.trim() : "";
  const publishDateRaw = body?.publishDate;
  const image = body?.image;

  if (!title) {
    errors.push("title is required.");
  } else if (title.length > 200) {
    errors.push("title must be 200 characters or fewer.");
  }

  if (!noticeBody) {
    errors.push("body is required.");
  }

  if (!CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${CATEGORIES.join(", ")}.`);
  }

  if (!PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(", ")}.`);
  }

  let publishDate = null;
  if (!publishDateRaw) {
    errors.push("publishDate is required.");
  } else {
    const parsed = new Date(publishDateRaw);
    if (Number.isNaN(parsed.getTime())) {
      errors.push("publishDate must be a valid date.");
    } else {
      publishDate = parsed;
    }
  }

  let safeImage = null;
  if (image !== undefined && image !== null && image !== "") {
    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      errors.push("image must be a valid image file.");
    } else if (image.length > MAX_IMAGE_LENGTH) {
      errors.push("image is too large. Please use a smaller file (under ~3MB).");
    } else {
      safeImage = image;
    }
  }

  if (errors.length > 0) {
    return { errors, data: null };
  }

  return {
    errors: [],
    data: {
      title,
      body: noticeBody,
      category,
      priority,
      publishDate,
      image: safeImage,
    },
  };
}
