import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | TeluguColleges",
  description: "Manage your shortlisted colleges and account settings on TeluguColleges.com.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
