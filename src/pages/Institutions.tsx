import { useState, useMemo, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { institutions } from "@/data/mockData";
import { getInstitute } from "@/api/services/instituteService";
import InstituteCard2 from "@/components/InstituteCard2";
import InstituteCard2Skeleton from "@/components/InstituteCard2Skeleton";
import { Institution } from "@/types/appwrite";

const Institutions = () => {
  const [institutes, setInstitutes] = useState<Institution[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [isLoading, setIsLoading] = useState(true);

  const filteredInstitutions = useMemo(() => {
    let filtered = institutions;

    if (searchQuery) {
      filtered = filtered.filter(
        (inst) =>
          inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((inst) => inst.status === statusFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "students":
          return b.totalStudents - a.totalStudents;
        case "problems":
          return b.totalProblemsSolved - a.totalProblemsSolved;
        case "recent":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      const response = await getInstitute(null, searchQuery, 1, 12);
      if (response.success && response.data) {
        // TODO: Look into typescript problem here.
        setInstitutes(response.data);
      }
      setIsLoading(false);
    };
    fetchColleges();
  }, [])

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Institutions</h1>
          <p className="text-muted-foreground">
            Browse and compare 18400 institutions on my registry
          </p> { /* TODO: Use metadata counter here. */}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Incomplete">Incomplete</SelectItem>
                  <SelectItem value="Scrapping">Scrapping</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Highest Score</SelectItem>
                  <SelectItem value="students">Most Students</SelectItem>
                  <SelectItem value="problems">Most Problems Solved</SelectItem>
                  <SelectItem value="recent">Recently Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {institutes.length} of 18400 institutions
          </p> { /* TODO: Use metadata counter here for totalInstitutes */}
        </div>

        {/* Institutions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, idx) => (
              <InstituteCard2Skeleton key={idx} />
            ))}
          </div>
        ) : filteredInstitutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              institutes.map((college, idx) => (
                <InstituteCard2
                  key={college.$id || idx}
                  id={college.$id || ""}
                  name={college.name}
                  score={college.score}
                  students={college.totalStudents}
                  status={college.status}
                  creationDate={college.$createdAt || ""}
                  problemsSolved={0}
                />
              ))
            }
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No institutions found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Institutions;
