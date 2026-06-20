import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "../lib/prisma";
import NoticeCard from "../components/NoticeCard";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/notices/${pendingDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Could not delete this notice.");
      }

      setNotices((prev) => prev.filter((n) => n.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
      </Head>

      <div className="min-h-screen bg-paper">
        <header className="border-b border-black/5 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                Reno Platforms
              </p>
              <h1 className="font-display text-2xl font-extrabold text-ink">
                Notice Board
              </h1>
            </div>
            <Link
              href="/notices/new"
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              + New notice
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          {deleteError ? (
            <div className="mb-4 rounded-xl border border-urgent/30 bg-urgent/5 p-4 text-sm text-urgent">
              {deleteError}
            </div>
          ) : null}

          {notices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-12 text-center">
              <h2 className="font-display text-lg font-bold text-ink">
                No notices yet
              </h2>
              <p className="mt-1.5 text-sm text-ink/60">
                Post your first notice so people know what&apos;s happening.
              </p>
              <Link
                href="/notices/new"
                className="mt-5 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                + New notice
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onDeleteRequest={setPendingDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this notice?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null);
          setDeleteError("");
        }}
      />
    </>
  );
}

export async function getServerSideProps() {
  // Fetched directly via Prisma on the server, on every request, so the
  // list always reflects the current database state — no stale cache, and
  // data survives refreshes/redeploys because it lives in the hosted DB.
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}
