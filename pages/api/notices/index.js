import { prisma } from "../../../lib/prisma";
import { validateNotice } from "../../../lib/validateNotice";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return handleList(req, res);
  }
  if (req.method === "POST") {
    return handleCreate(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function handleList(req, res) {
  try {
    // Urgent-first ordering happens here, in the database query.
    // priority is a MySQL ENUM("Normal", "Urgent"), so "desc" sorts by the
    // enum's declared ordinal and reliably puts every Urgent notice above
    // every Normal one, regardless of publishDate.
    const notices = await prisma.notice.findMany({
      orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
    });
    return res.status(200).json(notices);
  } catch (error) {
    console.error("GET /api/notices failed:", error);
    return res.status(500).json({ error: "Could not load notices." });
  }
}

async function handleCreate(req, res) {
  const { errors, data } = validateNotice(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed.", details: errors });
  }

  try {
    const notice = await prisma.notice.create({ data });
    return res.status(201).json(notice);
  } catch (error) {
    console.error("POST /api/notices failed:", error);
    return res.status(500).json({ error: "Could not create notice." });
  }
}
