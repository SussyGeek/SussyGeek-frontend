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
): Institution => (
    {
        name,
        slug,
        city: location?.city ?? '',
        state: location?.state ?? '',
        country: location?.country ?? '',
        score: 0,
        students: registeredGeeks ?? 0,
        scrappedStudents: 0,
        status: "Incomplete"
    }
);

export const prepInstituteBlocks = (
    blocks: number[]
) => {
    let handledBlocks = [];
    for(let b = 0 ; b < blocks.length ; b+=3){
      let start = blocks[b+1], end = blocks[b+2];
      let interval = end - start;
      handledBlocks.push({
        status: blocks[b],
        startPage: blocks[b+1],
        endPage: blocks[b+2],
        percentage: Math.ceil((( Math.abs((interval)-100) )/(interval))*100)
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