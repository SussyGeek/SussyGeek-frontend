export interface Student {
  $id: string
  name: string
  username: string
  solved: number
  score: number
  streak: number
  contestRating: number
  difficultySolved: number[] | null
  $createdAt: string
  $updatedAt: string
}

export interface User {
  $id: string;
  username: string;
  state: string
  $createdAt?: string
  $updatedAt?: string
}

export interface Institution {
  $id: string
  name: string
  slug: string
  city: string | null,
  state: string | null,
  country: string | null,
  blocks: number[]
  score: number
  totalStudents: number
  scrappedStudents: number
  problemsSolved: number
  status: "Complete" | "Incomplete" | "Scrapping"
  $createdAt?: string
  $updatedAt?: string
}

export interface InstituteBlock {
  status: number;
  startPage: number;
  endPage: number;
  percentage: number;
}


export interface ContributionRow {
  uid: string;
  seconds: number;
  students: number;
  startPage: number;
  user: User
  instituteId: string;
  assignedBlock: number;
  leaseExpiresAt: number;
  lastHeartbeatAt: number;
}
