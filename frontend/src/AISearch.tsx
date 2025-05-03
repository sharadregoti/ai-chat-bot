"use client"
import { Card } from "@/components/ui/card"
import { Sparkles, CornerDownLeft } from "lucide-react"

interface SuggestionCardProps {
  prompt: string
  description: string
  onClick?: () => void
}

export default function SuggestionCard({
  prompt = "grav",
  description = "Find the answer with AI",
  onClick = () => {},
}: SuggestionCardProps) {
  return (
    <Card
      className="flex items-center justify-between p-4 bg-[#FFF5F2] border-none cursor-pointer hover:bg-[#FFE8E2] transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-amber-700" />
        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-[#4A2B19]">Ask &quot;{prompt}&quot;</h3>
          <p className="text-[#8D6E57]">{description}</p>
        </div>
      </div>
      <div className="bg-[#D73A2C] p-2 rounded-md text-white">
        <CornerDownLeft className="h-5 w-5" />
      </div>
    </Card>
  )
}
