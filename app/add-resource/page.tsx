import { redirect } from "next/navigation";

/** Old URL — submissions now live at /submit/<section>. */
export default function Page() {
  redirect("/submit/resources");
}
