import { Video, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_META = {
  pending:   { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "مؤكّد",        color: "bg-green-100 text-green-700" },
  completed: { label: "مكتمل",        color: "bg-blue-100 text-blue-700" },
  cancelled: { label: "ملغي",         color: "bg-red-100 text-red-700" },
};

const LessonCard = ({ lesson }) => {
  const meta = STATUS_META[lesson.status] || STATUS_META.pending;
  const date = new Date(lesson.scheduledAt);

  return (
    <Card className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-primary" />
        </div>
        <Badge className={meta.color}>{meta.label}</Badge>
      </div>

      <div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          {lesson.teacher?.name}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <Clock className="w-3.5 h-3.5" />
          {date.toLocaleString("ar-EG")}
          <span className="mr-1">({lesson.durationMinutes} دقيقة)</span>
        </p>
      </div>

      {lesson.jitsiRoomUrl && (lesson.status === "pending" || lesson.status === "confirmed") && (
        <Button
          size="sm"
          className="mt-auto"
          onClick={() => window.open(lesson.jitsiRoomUrl, "_blank")}
        >
          انضم للدرس
        </Button>
      )}
    </Card>
  );
};

export default LessonCard;
