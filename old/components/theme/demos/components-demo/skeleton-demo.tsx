import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Skeleton } from "../../../ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="flex w-full flex-col flex-wrap items-center justify-center gap-4">
      <div className="flex w-fit items-center gap-4">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="grid gap-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="w-full @md:w-auto @md:min-w-sm">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-square w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
