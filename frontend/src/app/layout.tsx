import type { Metadata } from "next"
import Layout from "@/components/Layout"
import "./globals.css"
import { ReduxProvider } from "@/components/ReduxPrivider";
// import { Inter } from "next/font/google"
// const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: "POS - Pangsagis",
  description: "Created by Pangsagis",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
      //  className={inter.className}
      >
        <ReduxProvider>
          <Layout>
            {children}
          </Layout>
        </ReduxProvider>
      </body>
    </html>
  )
}
