import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Lora } from "next/font/google";
import Link from "next/link";
import { CONTACT_EMAIL, navLinks } from "@/lib/content";
import { Mark } from "./_components/mark";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800", "900"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "LNU AI Society — build the future of AI",
  description:
    "A student society at Linnaeus University for people who want to work with AI systems, not just read about them. Workshops, hack nights, reading groups. Växjö and Kalmar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="font-sans">
        <header className="sticky top-0 z-50 flex items-center justify-between gap-6 border-b border-chalk/10 bg-ink/80 px-5 py-3.5 backdrop-blur-md sm:px-10">
          <Link href="/#top" className="flex items-center gap-3 text-chalk">
            <Mark className="w-[58px] shrink-0 text-gold" />
            <span className="flex flex-col leading-[1.05]">
              <span className="text-[15px] font-extrabold tracking-[-0.02em]">
                LNU AI Society
              </span>
              <span className="font-mono text-[9.5px] tracking-[0.08em] text-chalk/45">
                LINNAEUS UNIVERSITY
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-[13.5px] font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hidden text-chalk/70 transition-colors hover:text-gold md:block"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="rounded-[2px] bg-gold px-[18px] py-2.5 font-semibold text-ink transition-colors hover:bg-gold-hi"
            >
              Contact
            </Link>
          </nav>
        </header>

        {children}

        <footer className="px-5 pt-15 pb-8 sm:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col gap-10 border-b border-chalk/12 pb-11 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <Mark className="w-[60px] shrink-0 text-gold" />
                  <span className="text-base font-extrabold tracking-[-0.02em]">
                    LNU AI Society
                  </span>
                </div>
                <p className="max-w-[300px] text-sm leading-relaxed text-chalk/50">
                  A student society at Linnaeus University, Växjö and Kalmar.
                  Run by students, open to everyone.
                </p>
              </div>

              <FooterColumn title="REACH US">
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold">
                  {CONTACT_EMAIL}
                </a>
                <span className="text-chalk/50">
                  Universitetsplatsen 1
                  <br />
                  352 52 Växjö
                </span>
              </FooterColumn>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-5 pt-5.5 font-mono text-[10.5px] tracking-[0.06em] text-chalk/38">
              <span>© {new Date().getFullYear()} LNU AI SOCIETY</span>
              <span>WWW.LNUAIS.COM</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-2.5 text-sm">
      <div className="mb-1 font-mono text-[10px] tracking-[0.1em] text-chalk/40">
        {title}
      </div>
      {children}
    </div>
  );
}
