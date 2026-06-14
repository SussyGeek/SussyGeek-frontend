import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const MainAreaSkeleton = () => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Title Area */}
      <div className="mb-6">
        <Skeleton className="h-10 w-[300px] mb-3" />
        <Skeleton className="h-5 w-[400px]" />
      </div>

      {/* Alert Component */}
      <Skeleton className="h-[74px] w-full rounded-lg" />

      {/* Big Main Card */}
      <Card className="border-2 shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <Skeleton className="h-8 w-[350px]" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
            <Skeleton className="h-6 w-[80px] rounded-full" />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* UserCard */}
              <div className="bg-secondary/10 rounded-lg p-4 space-y-5 min-h-[10em]">
                <Skeleton className="h-7 w-[120px]" />
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-[60px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-8 w-[60px] ml-auto" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                </div>
              </div>

              {/* ContributorsCard */}
              <div className="bg-secondary/10 rounded-lg p-4 space-y-4 min-h-[10em]">
                <Skeleton className="h-7 w-[150px]" />
                <div className="flex justify-center items-center h-[100px]">
                  <Skeleton className="h-14 w-14 rounded-full" />
                </div>
              </div>

              {/* Progress StateCounterCard */}
              <div className="bg-secondary/10 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>

              {/* Blocks StateCounterCard */}
              <div className="bg-secondary/10 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-6 w-[80px]" />
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded-md" />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-muted/20 py-4 min-h-[3.2em]">
          <Skeleton className="h-10 w-[140px]" />
        </CardFooter>
      </Card>
    </div>
  );
};

export const SidebarSkeleton = () => {
  return (
    <div className="lg:col-span-1 space-y-6">
      
      {/* Hall of Fame */}
      <Card>
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-[160px]" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[70px]" />
                </div>
              </div>
              <Skeleton className="h-6 w-[40px]" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-[120px]" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[95%]" />
        </CardContent>
      </Card>

    </div>
  );
};

const ContributionSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MainAreaSkeleton />
          <SidebarSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ContributionSkeleton;
