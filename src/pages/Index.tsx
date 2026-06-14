import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/StatsCard";
import { statsFields, initialStats } from "@/data/statsFields";
import InstituteCard from "@/components/InstituteCard";
import { getInstitute } from "@/api/services/instituteService";
import { getStats } from "@/api/services/counterService";
import { Institution } from "@/types/appwrite";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(initialStats);
  const [page, _setPage] = useState(1);
  const [limit, _setLimit] = useState(3);
  const [institutes, setInstitutes] = useState<Institution[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/institutions?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/institutions');
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await getStats();
        if (statsRes.success && statsRes.data) {
          setStats((prev) => ({ ...prev, ...statsRes.data }));
        } else {
          setStats((prev) => ({ ...prev, totalInstitutions: 18400 }));
        }
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    const fetchColleges = async () => {
      const institute = await getInstitute(null, '', page, limit);
      if (institute.success && institute.data) {
        setInstitutes(institute.data);
      }
    }

    fetchColleges();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            GeeksForGeeks Institution Rankings
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover and compare DSA scores of students across institutions
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by institution name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {
            statsFields.map((field, idx) => (
              <StatsCard
                title={field.title}
                counter={stats[field.slug]}
                description={field.description}
                icon={field.icon}
                key={field.slug + idx}
              />
            ))
          }
        </div>
      </section>

      {/* Top Institutions Preview */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Top Institutions</h3>
          <Button variant="link" onClick={() => navigate("/institutions")}>
            View All →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes.map((college, idx) => (
            <InstituteCard
              id={college.$id || ""}
              name={college.name}
              score={college.score}
              students={college.students}
              status={college.status}
              key={college.$id || idx} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
