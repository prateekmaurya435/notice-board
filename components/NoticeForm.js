import { useState } from "react";

const CATEGORIES = ["Exam", "Event", "General"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB, matches the server-side limit

function toDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

export default function NoticeForm({
  initialValues,
  onSubmit,
  submitting = false,
  submitLabel = "Save notice",
  serverError,
}) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [body, setBody] = useState(initialValues?.body || "");
  const [category, setCategory] = useState(initialValues?.category || "General");
  const [priority, setPriority] = useState(initialValues?.priority || "Normal");
  const [publishDate, setPublishDate] = useState(
    toDateInputValue(initialValues?.publishDate) || toDateInputValue(new Date())
  );
  const [image, setImage] = useState(initialValues?.image || null);
  const [imageError, setImageError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be smaller than 3MB.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImage(dataUrl);
    } catch {
      setImageError("Could not read that file. Please try another image.");
    }
  }

  function validateClientSide() {
    const errors = [];
    if (!title.trim()) errors.push("Title is required.");
    if (!body.trim()) errors.push("Body is required.");
    if (!publishDate) errors.push("Publish date is required.");
    return errors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validateClientSide();
    setFieldErrors(errors);
    if (errors.length > 0) return;

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      category,
      priority,
      publishDate,
      image,
    });
  }

  const allErrors = [...fieldErrors, ...(serverError ? [serverError] : [])];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {allErrors.length > 0 ? (
        <div className="rounded-xl border border-urgent/30 bg-urgent/5 p-4 text-sm text-urgent">
          <ul className="list-inside list-disc space-y-0.5">
            {allErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-ink">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          placeholder="e.g. Mid-semester exam schedule released"
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-brand-400"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-ink">
          Body
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={5}
          placeholder="Details for the notice…"
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-brand-400"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-ink">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-sm font-semibold text-ink">Priority</span>
          <div className="mt-1.5 flex gap-2">
            {["Normal", "Urgent"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  priority === p
                    ? p === "Urgent"
                      ? "border-urgent bg-urgent text-white"
                      : "border-brand-500 bg-brand-500 text-white"
                    : "border-black/10 text-ink/60 hover:border-black/20"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="publishDate" className="block text-sm font-semibold text-ink">
          Publish date
        </label>
        <input
          id="publishDate"
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          required
          className="mt-1.5 w-full max-w-xs rounded-xl border border-black/10 px-4 py-2.5 text-sm text-ink focus:border-brand-400"
        />
      </div>

      <div>
        <span className="block text-sm font-semibold text-ink">
          Image <span className="font-normal text-ink/40">(optional)</span>
        </span>
        <div className="mt-1.5 flex items-center gap-4">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="Notice preview"
              className="h-16 w-16 rounded-lg object-cover"
            />
          ) : null}
          <label className="cursor-pointer rounded-xl border border-dashed border-black/20 px-4 py-2.5 text-sm font-medium text-ink/60 hover:border-brand-400 hover:text-brand-600">
            {image ? "Replace image" : "Choose image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {image ? (
            <button
              type="button"
              onClick={() => setImage(null)}
              className="text-sm font-medium text-ink/50 hover:text-urgent"
            >
              Remove
            </button>
          ) : null}
        </div>
        {imageError ? (
          <p className="mt-1.5 text-sm text-urgent">{imageError}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
