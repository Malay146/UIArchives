import { redirect } from "next/navigation";

/** Old URL — the Motion section is now Designs. */
export default function Page() {
  redirect("/designs");
}
