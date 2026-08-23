import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { BookOpen, Trophy, Star, Sparkles, Gift, ChevronLeft, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { Card } from "@/components/ui/card";
import { gradeLabel } from "../../lib/grades";

const POINTS_MAX = 2000;

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const results = useQueries({
    queries: [
      { queryKey: ["materials", user?.grade], queryFn: () => api.getMaterials({ grade: user?.grade }), staleTime: 60_000 },
      { queryKey: ["challenges"],             queryFn: () => api.getChallenges(),                       staleTime: 60_000 },
      { queryKey: ["myRewards"],              queryFn: () => api.getMyRewards(),                        staleTime: 60_000 },
      { queryKey: ["softSkills"],             queryFn: () => api.getSoftSkills(),                       staleTime: 60_000 },
      { queryKey: ["leaderboard"],            queryFn: () => api.getLeaderboard(),                      staleTime: 60_000 },
      { queryKey: ["teachers"],              queryFn: () => api.getTeachers(),                          staleTime: 120_000 },
    ],
  });

  const loading = results.some((r) => r.isLoading);

  const materials  = (results[0].data?.materials  ?? results[0].data  ?? []).slice(0, 4);
  const challenges = (results[1].data?.challenges ?? results[1].data  ?? []).slice(0, 4);
  const myRewards  =  results[2].data?.rewards    ?? results[2].data  ?? [];
  const softSkills = (results[3].data?.skills     ?? results[3].data  ?? []).slice(0, 3);
  const board      =  results[4].data?.leaderboard ?? results[4].data ?? [];
  const teachers   =  results[5].data?.teachers   ?? results[5].data  ?? [];

  const points        = user?.points ?? 0;
  const badges        = myRewards.filter((r) => r.type === "badge");
  const pendingSkills = softSkills.filter((s) => !s.submitted);
  const progressPct   = Math.min((points / POINTS_MAX) * 100, 100).toFixed(1);
  const rankIdx       = board.findIndex((s) => s._id === user?._id || s.id === user?.id);
  const rank          = rankIdx >= 0 ? rankIdx + 1 : null;

  // المدرس المناوب: أول مدرس في القائمة (يُستبدل بـ API حقيقي لاحقاً)
  const onDutyTeacher = teachers[0] ?? null;

  return (
    <div dir="rtl" className="max-w-5xl mx-auto space-y-6">

      {/* ── ترحيب ── */}
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">أهلاً، {user?.name} 👋</h1>
          <p className="text-blue-100 text-sm mt-1">{gradeLabel(user?.grade) || "طالب"} · استمر في التعلم!</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Chip icon="⭐" label="النقاط"  value={points.toLocaleString("ar-EG")} />
          <Chip icon="🛡️" label="الشارات" value={badges.length} />
          {rank && <Chip icon="🏆" label="الترتيب" value={`#${rank}`} />}
        </div>
      </div>

      {/* ── شريط تقدم النقاط ── */}
      <Card className="p-4">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>التقدم نحو {POINTS_MAX.toLocaleString("ar-EG")} نقطة</span>
          <span className="font-bold text-blue-600">{progressPct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </Card>

      {/* ── بطاقات إحصاء سريعة ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen  className="w-5 h-5 text-blue-600"    />} bg="bg-blue-50"    label="المواد"     value={loading ? "…" : materials.length}      />
        <StatCard icon={<Trophy    className="w-5 h-5 text-amber-600"   />} bg="bg-amber-50"   label="التحديات"   value={loading ? "…" : challenges.length}     />
        <StatCard icon={<Sparkles  className="w-5 h-5 text-purple-600"  />} bg="bg-purple-50"  label="مهام ناعمة" value={loading ? "…" : pendingSkills.length}   />
        <StatCard icon={<Gift      className="w-5 h-5 text-emerald-600" />} bg="bg-emerald-50" label="مكافآتي"    value={loading ? "…" : myRewards.length}      />
      </div>

      {/* ── شبكة رئيسية ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          {/* المواد الأخيرة */}
          <Section title="آخر المواد التعليمية" action={{ label: "عرض الكل", onClick: () => navigate("/materials") }}>
            {loading && <Skeleton rows={3} />}
            {!loading && materials.length === 0 && <Empty text="لا توجد مواد بعد" />}
            {materials.map((m) => (
              <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={() => navigate("/materials")}>
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg shrink-0">
                  {m.type === "video" ? "🎬" : m.type === "pdf" ? "📄" : "🖼️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{m.title}</p>
                  <p className="text-xs text-slate-400">{m.subject}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ))}
          </Section>

          {/* التحديات */}
          <Section title="التحديات المتاحة" action={{ label: "عرض الكل", onClick: () => navigate("/challenges") }}>
            {loading && <Skeleton rows={3} />}
            {!loading && challenges.length === 0 && <Empty text="لا توجد تحديات بعد" />}
            {challenges.map((c) => (
              <div key={c._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={() => navigate("/challenges")}>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-amber-600" />
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

        {/* عمود جانبي */}
        <div className="space-y-5">

          {/* المدرس المناوب */}
          <OnDutyWidget teacher={onDutyTeacher} loading={results[5].isLoading} onChat={() => navigate("/chat")} />

          {/* مهام المهارات الناعمة */}
          <Section title="مهام المهارات الناعمة" action={{ label: "عرض الكل", onClick: () => navigate("/soft-skills") }}>
            {loading && <Skeleton rows={2} />}
            {!loading && softSkills.length === 0 && <Empty text="لا توجد مهام" />}
            {softSkills.map((s) => (
              <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={() => navigate("/soft-skills")}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.submitted ? "bg-emerald-100" : "bg-slate-100"}`}>
                  {s.submitted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{s.title}</p>
                  <p className="text-xs text-slate-400">{s.submitted ? "تم التسليم" : "في الانتظار"}</p>
                </div>
              </div>
            ))}
          </Section>

          {/* شاراتي */}
          <Section title="شاراتي" action={{ label: "عرض الكل", onClick: () => navigate("/rewards") }}>
            {loading && <Skeleton rows={1} />}
            {!loading && badges.length === 0 && <Empty text="لم تحصل على شارات بعد" />}
            <div className="flex flex-wrap gap-3 pt-1">
              {badges.slice(0, 6).map((b) => (
                <div key={b._id ?? b.id} title={b.title} className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition">
                  {b.emoji}
                </div>
              ))}
            </div>
          </Section>

          {/* نقاطي */}
          <Card className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-800">نقاطي</h3>
            </div>
            <p className="text-3xl font-extrabold text-blue-700">{points.toLocaleString("ar-EG")}</p>
            <p className="text-xs text-slate-400 mt-1">نقطة خبرة مكتسبة</p>
            <button onClick={() => navigate("/leaderboard")} className="mt-4 w-full border border-blue-300 text-blue-600 text-sm font-bold py-2 rounded-xl hover:bg-blue-50 transition">
              المتصدرون
            </button>
          </Card>

        </div>
      </div>
    </div>
  );
}

// ── OnDutyWidget ──────────────────────────────────────────────────────────────
function OnDutyWidget({ teacher, loading, onChat }) {
  return (
    <Card className="p-4 border-emerald-100 bg-emerald-50">
      <p className="text-xs font-bold text-emerald-700 mb-3">👨‍🏫 المدرس المناوب الآن</p>
      {loading && <div className="h-10 bg-emerald-100 rounded-xl animate-pulse" />}
      {!loading && !teacher && <p className="text-xs text-slate-400">لا يوجد مدرس مناوب حالياً</p>}
      {!loading && teacher && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-800 shrink-0">
            {teacher.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{teacher.name}</p>
            <p className="text-xs text-slate-400">{teacher.subject}</p>
          </div>
          <button onClick={onChat} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0">
            <MessageSquare className="w-3 h-3" />
            اسأل
          </button>
        </div>
      )}
    </Card>
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
      <p className="text-xs text-blue-100">{label}</p>
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
      <div className="space-y-1">{children}</div>
    </Card>
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
