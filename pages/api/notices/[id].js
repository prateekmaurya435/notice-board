import { prisma } from "../../../lib/prisma";
import { validateNotice } from "../../../lib/validateNotice";

// MongoDB ObjectIds are 24-character hex strings.
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export default async function handler(req, res) {
  const { id } = req.query;

  if (typeof id !== "string" || !OBJECT_ID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid notice id." });
  }

  if (req.method === "GET") {
    return handleGet(req, res, id);
  }
  if (req.method === "PUT" || req.method === "PATCH") {
    return handleUpdate(req, res, id);
  }
  if (req.method === "DELETE") {
    return handleDelete(req, res, id);
  }

  res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function handleGet(req, res, id) {
  try {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      return res.status(404).json({ error: "Notice not found." });
    }
    return res.status(200).json(notice);
  } catch (error) {
    console.error(`GET /api/notices/${id} failed:`, error);
    return res.status(500).json({ error: "Could not load notice." });
  }
}

async function handleUpdate(req, res, id) {
  const { errors, data } = validateNotice(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed.", details: errors });
  }

  try {
    const notice = await prisma.notice.update({ where: { id }, data });
    return res.status(200).json(notice);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Notice not found." });
    }
    console.error(`PUT /api/notices/${id} failed:`, error);
    return res.status(500).json({ error: "Could not update notice." });
  }
}

async function handleDelete(req, res, id) {
  try {
    await prisma.notice.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Notice not found." });
    }
    console.error(`DELETE /api/notices/${id} failed:`, error);
    return res.status(500).json({ error: "Could not delete notice." });
  }
}
