import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import "@/styles/global.css";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jira",
  icons: { icon: "/icon.svg" },
};

interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <html>
      <body className={cn(font.className, "antialiased min-h-screen")}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
