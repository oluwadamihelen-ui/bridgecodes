import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: { absolute: "Admin | Bridgecodes" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!adminEnabled()) notFound(); // the admin area does not exist until a password is configured
  const signedIn = await isAdmin();
  return (
    <div className="admin">
      <header className="admin__bar">
        <div className="container admin__bar-inner">
          <div className="admin__brand"><Logo /><span className="badge badge--beta">Admin</span></div>
          <nav aria-label="Admin" className="admin__nav">
            {signedIn && <Link href="/admin">Products</Link>}
            <a href="/" target="_blank" rel="noopener noreferrer">View site</a>
            {signedIn && <LogoutButton />}
          </nav>
        </div>
      </header>
      <main id="main" className="container admin__main">{children}</main>
    </div>
  );
}
