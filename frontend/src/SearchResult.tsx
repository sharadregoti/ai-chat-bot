"use client"

import type React from "react"

import { Bell, ChevronRight, FileText } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface DocumentationSectionProps {
  title: string
  content: React.ReactNode
  onClick?: () => void
}

export default function DocumentationSection({
  title = "Installation",
  content,
  onClick = () => {},
}: DocumentationSectionProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-[#FFF6ED] border-none shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2 text-[#A89082]">
            <Bell className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Alert Engine</span>
          </div>
        </CardHeader>
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#FFF0E4] transition-colors"
          onClick={onClick}
        >
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#C25A28]" />
            <h2 className="text-xl font-semibold text-[#4A2B19]">{title}</h2>
          </div>
          <ChevronRight className="h-6 w-6 text-[#A89082]" />
        </div>
        <CardContent className="pt-0">
          <div className="border-l-4 border-[#E8D5C5] pl-6 py-2 ml-2 mt-4">
            <h3 className="text-xl font-medium text-[#6D4C41] mb-4">{title}</h3>
            <p className="font-medium text-[#8D6E57] mb-2">Be aware</p>
            <div className="text-[#6D4C41]">{content}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
