'use client'

import { SessionProvider } from "next-auth/react"
import { Suspense } from "react"

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </SessionProvider>
  )
}
