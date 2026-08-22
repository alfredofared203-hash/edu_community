import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarPlus } from "lucide-react";

const BookLessonDialog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);

  const { data: teachersData } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => api.getTeachers(),
    enabled: open,
  });
  const teachers = teachersData?.teachers || teachersData || [];

  const mutation = useMutation({
    mutationFn: () => api.bookLesson({ teacherId, scheduledAt, durationMinutes }),
    onSuccess: () => {
      toast.success("تم حجز الدرس بنجاح");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      setOpen(false);
      setTeacherId("");
      setScheduledAt("");
      setDurationMinutes(45);
    },
    onError: (err) => toast.error(err.message || "فشل الحجز"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <CalendarPlus className="w-4 h-4" />
          احجز درساً
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حجز درس جديد</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="space-y-1.5">
            <Label>المعلم</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="اختر معلماً" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id || t._id} value={t.id || t._id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>موعد الدرس</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>المدة (دقيقة)</Label>
            <Input
              type="number"
              min={15}
              max={180}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>

          <Button
            onClick={() => mutation.mutate()}
            disabled={!teacherId || !scheduledAt || mutation.isPending}
          >
            {mutation.isPending ? "جارٍ الحجز..." : "تأكيد الحجز"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookLessonDialog;
