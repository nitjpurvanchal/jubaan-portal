import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminAuth";
import BodhiLeaf from "@/components/BodhiLeaf";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = { title: "Admin login — JUBAAN", robots: "noindex,nofollow" };

export default async function AdminLoginPage() {
  const admin = await getAdminSession();
  if (admin) redirect("/admin");

  return (
    <div className="pt-[72px] min-h-[100svh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-gold/25 bg-coal/70 p-8 md:p-10">
        <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-6" glow />
        <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3 text-center">
          Restricted chamber
        </p>
        <h1 className="font-display text-3xl mb-2 text-center">Admin sign in</h1>
        <p className="text-cream/60 text-sm leading-relaxed mb-8 text-center">
          This page is not linked anywhere on the site. Sign in with your
          admin roll number to open the registers.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
