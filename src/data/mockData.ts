import { MockInstitution } from "@/types/mock_data";

export const institutions: MockInstitution[] = [
  {
    id: "1",
    name: "Indian Institute of Technology Delhi",
    code: "IITD",
    score: 45620,
    totalStudents: 342,
    totalProblemsSolved: 12840,
    status: "Complete",
    addedAt: "2024-01-15",
    students: [
      {
        id: "s1",
        name: "Arjun Sharma",
        branch: "Computer Science",
        score: 2845,
        problemsSolved: 456,
        profileUrl: "https://geeksforgeeks.org/user/arjun_sharma"
      },
      {
        id: "s2",
        name: "Priya Patel",
        branch: "Computer Science",
        score: 2620,
        problemsSolved: 432,
        profileUrl: "https://geeksforgeeks.org/user/priya_patel"
      },
      {
        id: "s3",
        name: "Rahul Verma",
        branch: "Electronics",
        score: 1980,
        problemsSolved: 365,
        profileUrl: "https://geeksforgeeks.org/user/rahul_verma"
      },
      {
        id: "s4",
        name: "Sneha Singh",
        branch: "Computer Science",
        score: 1765,
        problemsSolved: 298,
        profileUrl: "https://geeksforgeeks.org/user/sneha_singh"
      },
      {
        id: "s5",
        name: "Vikram Kumar",
        branch: "Mechanical",
        score: 1542,
        problemsSolved: 267,
        profileUrl: "https://geeksforgeeks.org/user/vikram_kumar"
      }
    ]
  },
  {
    id: "2",
    name: "National Institute of Technology Trichy",
    code: "NITT",
    score: 38920,
    totalStudents: 289,
    totalProblemsSolved: 10456,
    status: "Complete",
    addedAt: "2024-02-03",
    students: [
      {
        id: "s6",
        name: "Aditya Reddy",
        branch: "Computer Science",
        score: 2456,
        problemsSolved: 401,
        profileUrl: "https://geeksforgeeks.org/user/aditya_reddy"
      },
      {
        id: "s7",
        name: "Kavya Menon",
        branch: "Information Technology",
        score: 2234,
        problemsSolved: 387,
        profileUrl: "https://geeksforgeeks.org/user/kavya_menon"
      },
      {
        id: "s8",
        name: "Rohan Das",
        branch: "Computer Science",
        score: 2012,
        problemsSolved: 356,
        profileUrl: "https://geeksforgeeks.org/user/rohan_das"
      }
    ]
  },
  {
    id: "3",
    name: "Birla Institute of Technology Mesra",
    code: "BITM",
    score: 28450,
    totalStudents: 198,
    totalProblemsSolved: 7890,
    status: "Incomplete",
    addedAt: "2024-03-12",
    students: [
      {
        id: "s9",
        name: "Ananya Gupta",
        branch: "Computer Science",
        score: 2145,
        problemsSolved: 378,
        profileUrl: "https://geeksforgeeks.org/user/ananya_gupta"
      },
      {
        id: "s10",
        name: "Karthik Iyer",
        branch: "Electronics",
        score: 1876,
        problemsSolved: 342,
        profileUrl: "https://geeksforgeeks.org/user/karthik_iyer"
      }
    ]
  },
  {
    id: "4",
    name: "Delhi Technological University",
    code: "DTU",
    score: 32180,
    totalStudents: 256,
    totalProblemsSolved: 9234,
    status: "Scrapping",
    addedAt: "2024-03-20",
    students: []
  },
  {
    id: "5",
    name: "Vellore Institute of Technology",
    code: "VIT",
    score: 41230,
    totalStudents: 312,
    totalProblemsSolved: 11567,
    status: "Complete",
    addedAt: "2024-01-28",
    students: [
      {
        id: "s11",
        name: "Megha Krishnan",
        branch: "Computer Science",
        score: 2567,
        problemsSolved: 423,
        profileUrl: "https://geeksforgeeks.org/user/megha_krishnan"
      },
      {
        id: "s12",
        name: "Siddharth Nair",
        branch: "Information Technology",
        score: 2389,
        problemsSolved: 398,
        profileUrl: "https://geeksforgeeks.org/user/siddharth_nair"
      }
    ]
  },
  {
    id: "6",
    name: "Manipal Institute of Technology",
    code: "MIT",
    score: 25670,
    totalStudents: 187,
    totalProblemsSolved: 6890,
    status: "Incomplete",
    addedAt: "2024-02-18",
    students: [
      {
        id: "s13",
        name: "Ishaan Malhotra",
        branch: "Computer Science",
        score: 1923,
        problemsSolved: 334,
        profileUrl: "https://geeksforgeeks.org/user/ishaan_malhotra"
      }
    ]
  }
];
