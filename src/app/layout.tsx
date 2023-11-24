import "./globals.css";
import type { Metadata } from "next";
import { ModalProvider } from "../providers/modalProvider";
import QueryProviders from "../providers/queryProvider";
import SessionProviders from "@/providers/sessionProvider";
import ThemeProviders from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import TreeProviders from "@/providers/treeProvider";

export const metadata: Metadata = {
  title: "HRS",
  description: "Human Resource System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="font-pre">
        <QueryProviders>
          {/* <ThemeProviders> */}
          <TreeProviders>
            <SessionProviders>
              <ModalProvider />
              <Toaster />
              {children}
            </SessionProviders>
          </TreeProviders>
          {/* </ThemeProviders> */}
        </QueryProviders>
      </body>
    </html>
  );
}
