import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { api } from "../../lib/api";

export default function GradeSubmissionDialog({ skill, open, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState({}); // { [id]: { grade, feedback } }
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !skill) return;
    setLoading(true);
    setError("");
    api.getSoftSkillSubmissions(skill.id)
      .then((res) => {
        const list = res?.data?.submissions || res?.submissions || [];
        setSubmissions(list);
      })
      .catch((e) => setError(e.message || "فشل تحميل التسليمات"))
      .finally(() => setLoading(false));
  }, [open, skill]);

  const handleGrade = async (sub) => {
    const { grade, feedback } = grading[sub.id] || {};
    if (!grade) return;
    setSaving(sub.id);
    try {
      await api.gradeSubmission(sub.id, { grade: Number(grade), feedback });
      setSubmissions((prev) =>
        prev.map((s) => s.id === sub.id ? { ...s, grade: Number(grade), feedback } : s)
      );
    } catch (e) {
      alert(e.message || "فشل الحفظ");
    } finally {
      setSaving(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تصحيح تسليمات — {skill?.title}</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-sm text-gray-400">جاري التحميل...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && submissions.length === 0 && (
          <p className="text-sm text-gray-400">لا توجد تسليمات بعد.</p>
        )}

        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="border rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">{sub.studentName || sub.student?.name || "طالب"}</span>
                {sub.grade != null && (
                  <span className="text-green-600 font-bold">الدرجة: {sub.grade}</span>
                )}
              </div>
              {sub.fileUrl && (
                <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline text-xs">
                  عرض الملف
                </a>
              )}
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label>الدرجة (من 100)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={sub.grade ?? ""}
                    onChange={(e) =>
                      setGrading((prev) => ({ ...prev, [sub.id]: { ...prev[sub.id], grade: e.target.value } }))
                    }
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label>ملاحظات</Label>
                  <Textarea
                    rows={1}
                    defaultValue={sub.feedback ?? ""}
                    onChange={(e) =>
                      setGrading((prev) => ({ ...prev, [sub.id]: { ...prev[sub.id], feedback: e.target.value } }))
                    }
                  />
                </div>
                <Button
                  size="sm"
                  disabled={saving === sub.id}
                  onClick={() => handleGrade(sub)}
                >
                  {saving === sub.id ? "..." : "حفظ"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
