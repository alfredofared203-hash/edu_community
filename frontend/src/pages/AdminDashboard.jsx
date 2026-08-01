import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, ShieldAlert } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import StatCards from "../features/analytics/StatCards";
import AnalyticsCharts from "../features/analytics/AnalyticsCharts";

const ROLE_LABELS  = { student: "طالب", teacher: "معلم", admin: "مدير", supervisor: "مشرف" };
const GRADE_LABELS = {
  "primary-1": "الأول الابتدائي",  "primary-2": "الثاني الابتدائي",
  "primary-3": "الثالث الابتدائي", "primary-4": "الرابع الابتدائي",
  "primary-5": "الخامس الابتدائي", "primary-6": "السادس الابتدائي",
  "prep-1": "الأول الإعدادي",      "prep-2": "الثاني الإعدادي",    "prep-3": "الثالث الإعدادي",
  "sec-1":  "الأول الثانوي",       "sec-2":  "الثاني الثانوي",     "sec-3":  "الثالث الثانوي",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState(null);
  const [usersList,  setUsersList]  = useState([]);
  const [loading,    setLoading]    = useState(true);

  const loadData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([api.getAdminStats(), api.getAdminUsers()]);
      setAdminStats(statsRes);
      setUsersList(usersRes?.users || usersRes || []);
    } catch (e) {
      toast.error(e.message || "فشل تحميل بيانات لوحة التحكم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.role === "admin") loadData(); }, [user]);

  const handleDelete = async (userId) => {
    if (userId === user?.id) return toast.error("لا يمكنك حذف حسابك الشخصي!");
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المستخدم نهائياً؟")) return;
    try {
      await api.deleteUser(userId);
      toast.success("تم حذف المستخدم بنجاح");
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
      const statsRes = await api.getAdminStats();
      setAdminStats(statsRes);
    } catch (e) {
      toast.error(e.message || "فشل حذف المستخدم");
    }
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
        <div className="text-center py-16 text-gray-400">جاري تحميل لوحة التحكم...</div>
      ) : (
        <>
          {/* بطاقات الإحصائيات */}
          <StatCards stats={adminStats} />

          {/* الرسوم البيانية */}
          <AnalyticsCharts stats={adminStats} users={usersList} />

          {/* جدول المستخدمين */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4"
          >
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              إدارة مستخدمي المنصة ({usersList.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs">
                    <th className="pb-3 pr-2 font-semibold">الاسم</th>
                    <th className="pb-3 font-semibold">البريد الإلكتروني</th>
                    <th className="pb-3 font-semibold">الدور</th>
                    <th className="pb-3 font-semibold">الصف الدراسي</th>
                    <th className="pb-3 font-semibold">النقاط</th>
                    <th className="pb-3 pl-2 font-semibold text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {usersList.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-400">لا يوجد مستخدمون.</td></tr>
                  ) : usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-2 font-semibold text-gray-800">{usr.name}</td>
                      <td className="py-3 text-gray-500">{usr.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          usr.role === "admin"   ? "bg-red-50 text-red-600" :
                          usr.role === "teacher" ? "bg-green-50 text-green-600" :
                          "bg-blue-50 text-blue-600"
                        }`}>
                          {ROLE_LABELS[usr.role] || usr.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{GRADE_LABELS[usr.grade] || usr.grade || "-"}</td>
                      <td className="py-3 font-bold text-gray-800">{usr.points || 0}</td>
                      <td className="py-3 pl-2 text-center">
                        <button
                          onClick={() => handleDelete(usr.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
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
        </>
      )}
    </div>
  );
}
