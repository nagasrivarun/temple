import { getRecentDonations } from "@/app/actions/donations"

export async function RecentDonors() {
  const donations = await getRecentDonations(10)

  if (!donations.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Be the first to support our temple construction</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {donations.map((donation, index) => (
        <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {donation.donor_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{donation.donor_name}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {donation.message || "May blessings be upon all"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(donation.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="font-bold text-primary">${(donation.amount_cents / 100).toFixed(0)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
