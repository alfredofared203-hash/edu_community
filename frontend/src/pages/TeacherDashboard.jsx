import { useNavigate } from "react-router-dom";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Upload, Users, Sparkles, CheckCircle2, Clock, ChevronLeft, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Card } from "@/components/ui/card";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const results = useQueries({
    queries: [
      { queryKey: ["myMaterials", user?._id], queryFn: () => api.getMaterials({ teacher: user?._id ?? user?.id }), staleTime: 60_000 },
      { queryKey: ["softSkills"],             queryFn: () => api.getSoftSkills(),                                   staleTime: 60_000 },
      { queryKey: ["challenges"],             queryFn: () => api.getChallenges(),                                   staleTime: 60_000 },
    ],
  });

  const loading = results.some((r) => r.isLoading);

  const myMaterials = results[0].data?.materials ?? results[0].data ?? [];
  const softSkills  = results[1].data?.skills    ?? results[1].data ?? [];
  const challenges  = results[2].data?.challenges ?? results[2].data ?? [];

  // مهام تحتاج تصحيح (pending submissions)
  const pendingSkills = softSkills.filter((s) => s.pendingCount > 0);

  return (
    <div dir="rtl" className="max-w-5xl mx-auto space-y-6">

      {/* ── ترحيب ── */}
      <div className="bg-gradient-to-l from-emerald-600 to-teal-700 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">أهلاً، {user?.name} 👋</h1>
          <p className="text-emerald-100 text-sm mt-1">
            {user?.subject ? `مدرس ${user.subject}` : "مدرس"} · لوحة تحكمك
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Chip icon="📚" label="موادي"    value={loading ? "…" : myMaterials.length} />
          <Chip icon="✏️" label="تحتاج تصحيح" value={loading ? "…" : pendingSkills.length} />
        </div>
      </div>

      {/* ── بطاقات إحصاء ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard icon={<Upload   className="w-5 h-5 text-blue-600"    />} bg="bg-blue-50"    label="المواد المرفوعة"    value={loading ? "…" : myMaterials.length}   />
        <StatCard icon={<Sparkles className="w-5 h-5 text-purple-600"  />} bg="bg-purple-50"  label="مهام تنتظر تصحيح"  value={loading ? "…" : pendingSkills.length} />
        <StatCard icon={<BookOpen className="w-5 h-5 text-amber-600"   />} bg="bg-amber-50"   label="التحديات"           value={loading ? "…" : challenges.length}    />
      </div>

      {/* ── شبكة رئيسية ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          {/* موادي */}
          <Section title="موادي التعليمية" action={{ label: "رفع مادة جديدة", onClick: () => navigate("/materials") }}>
            {loading && <Skeleton rows={3} />}
            {!loading && myMaterials.length === 0 && <Empty text="لم ترفع أي مواد بعد" />}
            {myMaterials.slice(0, 5).map((m) => (
              <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={() => navigate("/materials")}>
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg shrink-0">
                  {m.type === "video" ? "🎬" : m.type === "pdf" ? "📄" : "🖼️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{m.title}</p>
                  <p className="text-xs text-slate-400">{m.subject} · {m.grade}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ))}
          </Section>

          {/* التحديات */}
          <Section title="التحديات" action={{ label: "عرض الكل", onClick: () => navigate("/challenges") }}>
            {loading && <Skeleton rows={3} />}
            {!loading && challenges.length === 0 && <Empty text="لا توجد تحديات" />}
            {challenges.slice(0, 4).map((c) => (
              <div key={c._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400">{c.subject} · {c.points} نقطة</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${
                  c.difficulty === "hard"   ? "bg-red-100 text-red-600"     :
                  c.difficulty === "medium" ? "bg-amber-100 text-amber-600" :
                                              "bg-emerald-100 text-emerald-600"}`}>
                  {c.difficulty === "hard" ? "صعب" : c.difficulty === "medium" ? "متوسط" : "سهل"}
                </span>
              </div>
            ))}
          </Section>
        </div>

        {/* عمود جانبي — مهام تنتظر تصحيح */}
        <div className="space-y-5">
          <Section title="مهام تنتظر تصحيح" action={{ label: "عرض الكل", onClick: () => navigate("/soft-skills") }}>
            {loading && <Skeleton rows={3} />}
            {!loading && pendingSkills.length === 0 && <Empty text="لا توجد مهام معلقة 🎉" />}
            {pendingSkills.map((s) => (
              <PendingSkillRow key={s._id ?? s.id} skill={s} onGraded={() => qc.invalidateQueries({ queryKey: ["softSkills"] })} />
            ))}
          </Section>

          {/* إجراءات سريعة */}
          <Card className="p-5 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">إجراءات سريعة</h3>
            <QuickAction label="رفع مادة جديدة"     icon={<Upload   className="w-4 h-4" />} color="blue"    onClick={() => navigate("/materials")}   />
            <QuickAction label="عرض المهارات الناعمة" icon={<Sparkles className="w-4 h-4" />} color="purple"  onClick={() => navigate("/soft-skills")} />
            <QuickAction label="تقييم المعلمين"       icon={<Users    className="w-4 h-4" />} color="emerald" onClick={() => navigate("/teachers")}    />
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── صف مهمة تنتظر تصحيح ──────────────────────────────────────────────────────
function PendingSkillRow({ skill, onGraded }) {
  const [grade, setGrade] = useState("");
  const [open, setOpen]   = useState(false);

  const mutation = useMutation({
    mutationFn: ({ subId, grade }) => api.gradeSubmission(subId, { grade: Number(grade) }),
    onSuccess: () => { toast.success("تم التصحيح"); setOpen(false); onGraded(); },
    onError:   (e) => toast.error(e.message || "فشل التصحيح"),
  });

  return (
    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <p className="text-sm font-semibold text-slate-800 truncate flex-1">{skill.title}</p>
        <span className="text-xs bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">{skill.pendingCount}</span>
      </div>
      {!open ? (
        <button onClick={() => setOpen(true)} className="text-xs text-amber-700 font-bold hover:underline">
          تصحيح ←
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="number" min="0" max="100"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="الدرجة / 100"
            className="flex-1 text-xs border border-amber-200 rounded-lg px-2 py-1 outline-none focus:border-amber-400"
          />
          <button
            disabled={!grade || mutation.isPending}
            onClick={() => mutation.mutate({ subId: skill._id ?? skill.id, grade })}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1 rounded-lg disabled:opacity-50 transition"
          >
            {mutation.isPending ? "…" : "حفظ"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── مكونات مساعدة ─────────────────────────────────────────────────────────────
function StatCard({ icon, bg, label, value }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </Card>
  );
}

function Chip({ icon, label, value }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
      <p className="text-xs text-emerald-100">{label}</p>
      <p className="text-lg font-extrabold">{icon} {value}</p>
    </div>
  );
}

function Section({ title, action, children }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">{title}</h3>
        {action && <button onClick={action.onClick} className="text-xs text-blue-600 font-semibold hover:underline">{action.label}</button>}
      </div>
      <div className="space-y-2">{children}</div>
    </Card>
  );
}

function QuickAction({ label, icon, color, onClick }) {
  const colors = {
    blue:   "bg-blue-50 text-blue-700 hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    emerald:"bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${colors[color]}`}>
      {icon}{label}
    </button>
  );
}

function Skeleton({ rows }) {
  return Array.from({ length: rows }).map((_, i) => (
    <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
  ));
}

function Empty({ text }) {
  return <p className="text-sm text-slate-400 text-center py-4">{text}</p>;
}
