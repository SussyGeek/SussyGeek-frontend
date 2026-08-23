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
        setInstitutes(institute.data as Institution[]);
      }
    }

    fetchColleges();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20 select-none">

      <section
        id="hero-section"
        className="relative min-h-[560px] overflow-hidden px-4 text-center"
      >
        {/* Globe background */}
        <div
          className=" absolute left-1/2 top-0 -translate-x-1/2 w-[1400px] h-[560px] bg-[url('/hero-bg-trans.png')] bg-no-repeat bg-center bg-top bg-contain opacity-45 pointer-events-none z-0" />

        {/* Hero content */}
        <div className="relative z-10 max-w-3xl mx-auto my-100 pt-40 w-full">
          <div className="w-full flex justify-center">
            <p className="w-fit rounded-full border border-green-400/50 bg-gradient-to-r from-green-500/15 to-emerald-400/10 px-4 py-1 text-xs font-bold text-green-600 shadow-[0_0_24px_rgba(34,197,94,0.22)] backdrop-blur-sm">
              GeeksForGeeks Utilities
            </p>
          </div>

          <h2 className="my-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Search. Compare.{" "}
            <span className="text-green-500 drop-shadow-[0_0_12px_rgba(34,197,94,0.2)]">
              Contribute.
            </span>
          </h2>

          <p className="mx-auto my-2 w-fit rounded-full bg-white/60 px-3 py-1 text-base md:text-lg font-medium text-foreground/80 backdrop-blur-sm">
            Discover and compare DSA scores of students across institutions
          </p>

          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-4xl mx-auto mt-3"
          >
            <div
              className=" relative flex-1 rounded-xl border border-white/70 bg-white/40 backdrop-blur-9xl shadow-[0_8px_32px_rgba(34,197,94,0.15)] ring-1 ring-green-400/2 " >
              <Search
                className=" absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-green-700/7 " />

              <Input
                type="text"
                placeholder="Search by institution name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=" h-12 pl-11 border-1 shadow-none focus-visible:ring-1 placeholder:text-foreground/80 bg-transparent" />
            </div>

            <Button
              type="submit"
              className="h-12 rounded-xl bg-green-600 px-6 shadow-[0_6px_20px_rgba(34,197,94,0.25)] hover:bg-green-700"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 pb-12">
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
              students={college.totalStudents}
              status={college.status}
              key={college.$id || idx} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
