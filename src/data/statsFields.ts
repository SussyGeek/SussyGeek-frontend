import {TrendingUp, Users, Award } from "lucide-react";

export const statsFields = [
    {
        slug: "totalInstitutions",
        title: "Total Institutions",
        description: "Tracked on platform",
        icon: TrendingUp
    },
    {
        slug: "totalStudents",
        title: "Total Students",
        description: "Active learners",
        icon: Users
    },
    // {
    //     slug: "totalScore",
    //     title: "Total Score",
    //     description: "Look at dem score :'<",
    //     icon: Users
    // },
    {
        slug: "totalProblems",
        title: "Problems Solved",
        description: "Across all institutes",
        icon: Award
    },
];


export const initialStats = Object.fromEntries(
  statsFields.map(f => [f.slug, 0])
);
