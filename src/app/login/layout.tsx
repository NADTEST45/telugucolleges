import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | TeluguColleges",
  description: "Log in or create an account to save and compare your favorite colleges on TeluguColleges.com.",
  openGraph: {
    title: "Login | TeluguColleges",
    description: "Log in or create an account to save and compare your favorite colleges.",
    images: [{ url: "https://telugucolleges.com/og-image.png", width: 1200, height: 630 }],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
