import { CounterKey, IStatsCardData } from "@/types/generic";

export const guideliens = [
  "Offensive usernames will be removed immediately.",
  "Single instance scraping only (one tab per user).",
  "Do not use VPNs that might trigger rate limits."
]

export const BUCKETS: string[] = [
  'bg-[#F3E2E2]', // 0–16 bg-[#F3E2E2]/20 <-- previously used
  'bg-[#d8e9c8]', // 17–33
  'bg-[#b7df9b]', // 34–50
  'bg-[#86c76a]', // 51–66
  'bg-[#4fa83d]', // 67–83
  'bg-[#166534]', // 84–100
];

export const InstituteStatsCardData: IStatsCardData[] = [
  {
    title: "Overall Score",
    description: "Aggregate of all students",
    counterKey: 'score'
  },
  {
    title: "Total students",
    description: "Active on platform",
    counterKey: 'totalStudents'
  },
  {
    title: "Problems Solved",
    description: "Cumulative total",
    counterKey: 'problemsSolved'
  }
];