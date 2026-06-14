import { Institution } from "@/types/appwrite";


export const prepInstitutionObject = (
  name: string,
  slug: string,
  registeredGeeks: number,
  location: {
    city: string,
    state: string,
    country: string
  }
): Omit<Institution, "$id" | "$createdAt" | "$updatedAt"> => (
  {
    name,
    slug,
    city: location?.city ?? '',
    state: location?.state ?? '',
    country: location?.country ?? '',
    score: 0,
    totalStudents: registeredGeeks ?? 0,
    scrappedStudents: 0,
    problemsSolved: 0,
    blocks: [],
    status: "Incomplete"
  }
);

export const prepInstituteBlocks = (
  blocks: number[]
) => {
  let handledBlocks = [];
  for (let b = 0; b < blocks.length; b += 3) {
    let startPage = blocks[b + 1], endPage = blocks[b + 2];
    let interval = (startPage - 1) - (endPage - 100);
    // Math.ceil((( Math.abs((interval)-100) )/(interval))*100)
    handledBlocks.push({
      status: blocks[b],
      startPage,
      endPage,
      percentage: (Math.floor((interval / 100)) * 100)
    })
  }

  return handledBlocks;
}


export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};