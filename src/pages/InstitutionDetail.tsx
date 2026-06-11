import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getInstitute } from "@/api/services/instituteService";
import InstituteNotFound from "@/components/InstituteNotFound";
import { Institution } from "@/types/appwrite";
import { InstituteStatsCardData } from "@/data/genericData";
import InstituteStatsCard from "@/components/InstituteDetail/InstituteStatsCard";
import InstitutionDetailSkeleton from "@/components/InstitutionDetailSkeleton";

const InstitutionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState<Institution | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      setIsLoading(true);
      const response = await getInstitute(id || null, '', 1, 1);
      if (response.success && response.data) {
        // @ts-ignore TODO: Fix this shit.
        setInstitute(response.data);
      }
      setIsLoading(false);
    };
    fetchCollege();
  }, [id]);

  if (isLoading) {
    return <InstitutionDetailSkeleton />;
  }

  if (!institute) {
    return (
      <InstituteNotFound />
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8">
        {/* Institution Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{institute.name}</h1>
              <p className="text-muted-foreground">Code: {institute.$id}</p>
            </div>
            <Badge
              variant={
                institute.status === "Complete"
                  ? "default"
                  : institute.status === "Incomplete"
                    ? "secondary"
                    : "outline"
              }
            >
              {institute.status}
            </Badge>
          </div>

          { /* TODO: Introduce dynamic icons for each one. i.e TrendingUp, Users, Award */}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {InstituteStatsCardData.map(stats => (
              <InstituteStatsCard
                title={stats.title}
                description={stats.description}
                counter={institute[stats.counterKey]}
              />
            ))}
          </div>
        </div>

        {/* Students Section */}
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              Search and filter students from {institute.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search students by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {[].map((branch) => ( // Changed from braches to []
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Students Table */}
            {[].length > 0 ? ( // changed from filtered students to []
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Problems Solved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {([/* filteredStudents */] as any[]).map((student, index) => ( // changed from filtered students to []
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <a
                            href={student.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {student.name}
                          </a>
                        </TableCell>
                        <TableCell>{student.branch}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {student.score.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">{student.problemsSolved}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contribution CTA for Incomplete/Scrapping Status */}
        {institute.status !== "Complete" && (
          <Card className="mt-6 border-primary/50">
            <CardHeader>
              <CardTitle>Help Us Complete This Institution</CardTitle>
              <CardDescription>
                This institution has {institute.status.toLowerCase()} status. You can contribute
                to add more student data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate(`/contribute/${institute.$id}`,
                {
                  state: {
                    name: institute.name
                  }
                }
              )}>
                Contribute Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InstitutionDetail;
