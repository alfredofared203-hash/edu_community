import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video, ChevronRight, ChevronLeft } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LessonCard from "./LessonCard";
import BookLessonDialog from "./BookLessonDialog";

const LessonsPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["lessons", page],
    queryFn: () => api.getLessons({ page, limit: 9 }),
  });

  const lessons = data?.lessons || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
            <Video className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">دروسي</h1>
            <p className="text-sm text-muted-foreground">دروسك المجدولة عبر الإنترنت</p>
          </div>
        </div>
        {user?.role === "student" && <BookLessonDialog />}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-muted-foreground">
          تعذّر تحميل الدروس. تأكّد أن السيرفر يعمل.
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-16">
          <Video className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">لا توجد دروس مجدولة حتى الآن.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((l) => (
              <LessonCard key={l.id} lesson={l} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="gap-1"
              >
                <ChevronRight className="w-4 h-4" /> السابق
              </Button>
              <span className="text-sm text-muted-foreground">
                صفحة {page} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                التالي <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LessonsPage;
