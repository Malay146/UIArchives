import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { getAdmin } from "@/lib/server/auth";
import { countByStatus, lastRuns, listItems } from "@/lib/server/db";
import { ReviewBoard } from "@/components/review/review-board";
import { headers } from "next/headers";
import { PasskeySignIn } from "@/components/review/passkey-sign-in";
import { maskedAdminEmail } from "@/lib/server/email-code";
import { hasAnyPasskey } from "@/lib/server/passkeys";

export const metadata: Metadata = { title: "Review", robots: { index: false, follow: false } };

export default async function Page() {
  const admin = await getAdmin();

  if (!admin) {
    const host = (await headers()).get("host") ?? "";
    const hasPasskey = await hasAnyPasskey(host.split(":")[0]).catch(() => false);
    return (
      <>
        <Header />
        <main className="grid min-h-[70dvh] place-items-center px-4">
          <PasskeySignIn hasPasskey={hasPasskey} email={maskedAdminEmail()} />
        </main>
      </>
    );
  }

  const [pending, approved, rejected, counts, runs] = await Promise.all([
    listItems("pending"),
    listItems("approved", undefined, 100),
    listItems("rejected", undefined, 100),
    countByStatus(),
    lastRuns(6),
  ]);

  return (
    <>
      <Header />
      <main>
        <ReviewBoard admin={admin} initial={{ pending, approved, rejected }} counts={counts} runs={runs} />
      </main>
    </>
  );
}
