import { Suspense } from "react"
import WeddingInvitation from "@/components/wedding-invitation"

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const guestName = searchParams.to as string | undefined

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <WeddingInvitation guestName={guestName || "Guest"} />
      </Suspense>
    </main>
  )
}

