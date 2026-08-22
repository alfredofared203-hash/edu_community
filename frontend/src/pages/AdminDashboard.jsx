import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Trash2, ShieldAlert, TrendingUp, BookOpen, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import StatCards from "../features/analytics/StatCards";

const ROLE_LABELS  = { student: "طالب", teacher: "معلم", admin: "مدير", supervisor: "مشرف" };
const GRADE_LABELS = {
  "primary-1":"الأول الابتدائي","primary-2":"الثاني الابتدائي","primary-3":"الثالث الابتدائي",
  "primary-4":"الرابع الابتدائي","primary-5":"الخامس الابتدائي","primary-6":"السادس الابتدائي",
  "prep-1":"الأول الإعدادي","prep-2":"الثاني الإعدادي","prep-3":"الثالث الإعدادي",
  "sec-1":"الأول الثانوي","sec-2":"الثاني الثانوي","sec-3":"الثالث الثانوي",
};
const ARABIC_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const CHART_STYLE = { fontFamily: "inherit", fontSize: 11 };

export default function AdminDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const results = useQueries({
    queries: [
      { queryKey: ["adminStats"], queryFn: () => api.getAdminStats(), staleTime: 60_000 },
      { queryKey: ["adminUsers"], queryFn: () => api.getAdminUsers(), staleTime: 60_000 },
      { queryKey: ["materials"],  queryFn: () => api.getMaterials({}), staleTime: 60_000 },
    ],
  });

  const loading   = results.some((r) => r.isLoading);
  const stats     = results[0].data;
  const usersList = results[1].data?.users ?? results[1].data ?? [];
  const materials = results[2].data?.materials ?? results[2].data ?? [];

  // ── نمو المستخدمين آخر 6 شهور ──────────────────────────────────────────────
  const growthData = useMemo(() => {
    const now   = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d     = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const year  = d.getFullYear();
      const month = d.getMonth();
      const count = usersList.filter((u) => {
        const c = new Date(u.createdAt);
        return c.getFullYear() === year && c.getMonth() === month;
      }).length;
      return { month: ARABIC_MONTHS[month], count };
    });
  }, [usersList]);

  // ── أكثر المواد حسب المادة الدراسية ────────────────────────────────────────
  const subjectData = useMemo(() => {
    const counts = materials.reduce((acc, m) => {
      if (m.subject) acc[m.subject] = (acc[m.subject] || 0) + 1;
      return acc;
    }, {});
    const max = Math.max(...Object.values(counts), 1);
    return Object.entries(counts)
      .map(([subject, count]) => ({ subject, count, pct: Math.round((count / max) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [materials]);

  // ── آخر النشاطات (مستخدمون جدد + مواد جديدة) ──────────────────────────────
  const recentActivity = useMemo(() => {
    const newUsers = usersList
      .slice(-5)
      .map((u) => ({ type: "user", label: `مستخدم جديد: ${u.name}`, time: u.createdAt, color: "bg-blue-500" }));
    const newMats = materials
      .slice(-5)
      .map((m) => ({ type: "material", label: `مادة جديدة: ${m.title}`, time: m.createdAt, color: "bg-emerald-500" }));
    return [...newUsers, ...newMats]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 8);
  }, [usersList, materials]);

  // ── حذف مستخدم ──────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteUser(id),
    onSuccess: (_, id) => {
      toast.success("تم حذف المستخدم");
      qc.setQueryData(["adminUsers"], (old) => {
        const list = old?.users ?? old ?? [];
        const next = list.filter((u) => u.id !== id && u._id !== id);
        return old?.users ? { ...old, users: next } : next;
      });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: (e) => toast.error(e.message || "فشل الحذف"),
  });

  const handleDelete = (userId) => {
    if (userId === user?.id || userId === user?._id) return toast.error("لا يمكنك حذف حسابك!");
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟")) return;
    deleteMutation.mutate(userId);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4 rounded-2xl p-6 bg-white border">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold">غير مصرح بالدخول</h2>
        <p className="text-sm text-gray-500">هذه الصفحة مخصصة لمديري النظام فقط.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم الإدارية</h1>
        <p className="text-gray-500 text-sm mt-1">مراقبة تفاعل المنصة وإدارة حسابات المستخدمين</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* بطاقات الإحصائيات */}
          <StatCards stats={stats} />

          {/* الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* نمو المستخدمين — Line */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm">نمو المستخدمين (آخر 6 شهور)</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={growthData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip style={CHART_STYLE} />
                  <Line type="monotone" dataKey="count" name="مستخدمون جدد" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* أكثر المواد حسب المادة — Bar */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-gray-800 text-sm">أكثر المواد حسب التخصص</h3>
              </div>
              {subjectData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">لا توجد مواد بعد</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={subjectData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="subject" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip style={CHART_STYLE} />
                    <Bar dataKey="count" name="عدد المواد" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* شبكة: جدول المستخدمين + آخر النشاطات */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* جدول المستخدمين */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                إدارة المستخدمين ({usersList.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-xs">
                      <th className="pb-3 pr-2 font-semibold">الاسم</th>
                      <th className="pb-3 font-semibold">البريد</th>
                      <th className="pb-3 font-semibold">الدور</th>
                      <th className="pb-3 font-semibold">الصف</th>
                      <th className="pb-3 font-semibold">النقاط</th>
                      <th className="pb-3 pl-2 font-semibold text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {usersList.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-400">لا يوجد مستخدمون.</td></tr>
                    ) : usersList.map((usr) => (
                      <tr key={usr.id ?? usr._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-2 font-semibold text-gray-800">{usr.name}</td>
                        <td className="py-3 text-gray-500 text-xs">{usr.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            usr.role === "admin"   ? "bg-red-50 text-red-600"     :
                            usr.role === "teacher" ? "bg-green-50 text-green-600" :
                                                     "bg-blue-50 text-blue-600"}`}>
                            {ROLE_LABELS[usr.role] || usr.role}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500 text-xs">{GRADE_LABELS[usr.grade] || usr.grade || "—"}</td>
                        <td className="py-3 font-bold text-gray-800">{usr.points || 0}</td>
                        <td className="py-3 pl-2 text-center">
                          <button
                            onClick={() => handleDelete(usr.id ?? usr._id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* آخر النشاطات */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-indigo-600" />
                آخر النشاطات
              </h3>
              {recentActivity.length === 0 && <p className="text-sm text-gray-400 text-center py-4">لا توجد نشاطات</p>}
              <div className="space-y-3 text-sm relative before:absolute before:right-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {recentActivity.map((a, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full ${a.color} text-white flex items-center justify-center z-10 text-xs shrink-0`}>
                      {a.type === "user" ? "👤" : "📄"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-xs">{a.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {a.time ? new Date(a.time).toLocaleDateString("ar-EG") : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </>
      )}
    </div>
  );
}
