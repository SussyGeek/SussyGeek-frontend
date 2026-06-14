import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInstitute, searchInstitutes } from "@/api/services/instituteService";
import InstituteCard2 from "@/components/InstituteCard2";
import InstituteCard2Skeleton from "@/components/InstituteCard2Skeleton";
import { Institution } from "@/types/appwrite";
import { useDebounce } from "@/hooks/useDebounce";

const Institutions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "all";
  
  const [institutes, setInstitutes] = useState<Institution[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [isLoading, setIsLoading] = useState(true);
  
  const defaultInstitutesCache = useRef<Institution[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInstitutes = async () => {
      setIsLoading(true);
      
      const query = debouncedSearch.trim();
      const params: Record<string, string> = {};
      if (query) params.search = query;
      if (statusFilter !== "all") params.status = statusFilter;
      
      setSearchParams(params, { replace: true });

      if (query) {
        const response = await searchInstitutes(query, 12, statusFilter);
        if (isMounted && response.success && response.data) {
          setInstitutes(response.data);
        }
      } else {
        if (defaultInstitutesCache.current !== null && statusFilter === "all") {
          setInstitutes(defaultInstitutesCache.current);
        } else {
          const response = await getInstitute(null, '', 1, 12, statusFilter);
          if (isMounted && response.success && response.data) {
            setInstitutes(response.data);
            if (statusFilter === "all") {
              defaultInstitutesCache.current = response.data;
            }
          }
        }
      }
      
      if (isMounted) setIsLoading(false);
    };

    fetchInstitutes();

    return () => { isMounted = false; };
  }, [debouncedSearch, statusFilter, setSearchParams]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search institutions by name..."
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
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {institutes.length} institutions
          </p>
        </div>

        {/* Institutions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, idx) => (
              <InstituteCard2Skeleton key={idx} />
            ))}
          </div>
        ) : institutes.length > 0 ? (
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
