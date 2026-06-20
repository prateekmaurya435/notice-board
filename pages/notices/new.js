import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import NoticeForm from "../../components/NoticeForm";

export default function NewNotice() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details?.join(" ") || data.error || "Could not create notice.");
      }

      router.push("/");
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>New notice · Notice Board</title>
      </Head>

      <div className="min-h-screen bg-paper">
        <header className="border-b border-black/5 bg-white">
          <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
            <Link href="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              ← Back to notices
            </Link>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">
              New notice
            </h1>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <NoticeForm
              onSubmit={handleSubmit}
              submitting={submitting}
              submitLabel="Publish notice"
              serverError={serverError}
            />
          </div>
        </main>
      </div>
    </>
  );
}
