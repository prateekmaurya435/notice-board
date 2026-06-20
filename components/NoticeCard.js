import Link from "next/link";

const CATEGORY_STYLES = {
  Exam: "bg-amber-100 text-amber-800",
  Event: "bg-sky-100 text-sky-800",
  General: "bg-slate-100 text-slate-700",
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NoticeCard({ notice, onDeleteRequest }) {
  const isUrgent = notice.priority === "Urgent";

  return (
    <article
      className={`flex h-full flex-col gap-3 rounded-2xl border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${
        isUrgent ? "border-urgent/40" : "border-black/5"
      }`}
    >
      {notice.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt=""
          className="h-36 w-full rounded-xl object-cover"
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {isUrgent ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-urgent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            ● Urgent
          </span>
        ) : null}
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General
          }`}
        >
          {notice.category}
        </span>
        <span className="text-xs font-medium text-ink/45">
          {formatDate(notice.publishDate)}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold leading-snug text-ink">
        {notice.title}
      </h3>

      <p className="line-clamp-3 flex-1 whitespace-pre-line text-sm text-ink/70">
        {notice.body}
      </p>

      <div className="mt-2 flex items-center gap-3 border-t border-black/5 pt-3 text-sm font-semibold">
        <Link
          href={`/notices/${notice.id}/edit`}
          className="text-brand-600 hover:text-brand-700"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDeleteRequest(notice)}
          className="text-urgent hover:text-urgent/80"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
