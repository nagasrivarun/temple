export interface DonationTier {
  id: string
  name: string
  description: string
  priceInCents: number
  icon: string
}

export const DONATION_TIERS: DonationTier[] = [
  {
    id: "bronze-donor",
    name: "కాంస్య దాత",
    description: "సాధారణ విరాళం",
    priceInCents: 50000, // ₹500
    icon: "🙏",
  },
  {
    id: "silver-donor",
    name: "రజత దాత",
    description: "మధ్యస్థ విరాళం",
    priceInCents: 100000, // ₹1000
    icon: "🪔",
  },
  {
    id: "gold-donor",
    name: "స్వర్ణ దాత",
    description: "ప్రధాన విరాళం",
    priceInCents: 500000, // ₹5000
    icon: "🏛️",
  },
  {
    id: "diamond-donor",
    name: "వజ్ర దాత",
    description: "ప్రధాన భాగస్వామి",
    priceInCents: 1000000, // ₹10000
    icon: "✨",
  },
]
