import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

const ROLE_COLORS   = { student: "#3b82f6", teacher: "#10b981", admin: "#f59e0b", supervisor: "#8b5cf6" };
const ROLE_LABELS   = { student: "طلاب", teacher: "معلمون", admin: "مديرون", supervisor: "مشرفون" };
const MONTH_COLORS  = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// بيانات وهمية للنشاط الشهري (تُستبدل بـ API لاحقاً)
const MONTHLY_ACTIVITY = [
  { month: "يناير",  posts: 12, challenges: 5 },
  { month: "فبراير", posts: 19, challenges: 8 },
  { month: "مارس",   posts: 15, challenges: 6 },
  { month: "أبريل",  posts: 27, challenges: 11 },
  { month: "مايو",   posts: 22, challenges: 9 },
  { month: "يونيو",  posts: 34, challenges: 14 },
];

const CHART_STYLE = { fontFamily: "inherit", fontSize: 12 };

export default function AnalyticsCharts({ stats, users }) {
  // توزيع الأدوار للـ Pie
  const roleData = (stats?.usersByRole || []).map((r) => ({
    name:  ROLE_LABELS[r.role] || r.role,
    value: Number(r.count),
    color: ROLE_COLORS[r.role] || "#94a3b8",
  }));

  // توزيع الصفوف الدراسية للـ Bar
  const gradeCounts = {};
  (users || []).forEach((u) => {
    if (u.grade) gradeCounts[u.grade] = (gradeCounts[u.grade] || 0) + 1;
  });
  const gradeData = Object.entries(gradeCounts)
    .map(([grade, count], i) => ({ grade, count, fill: MONTH_COLORS[i % MONTH_COLORS.length] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Pie — توزيع الأدوار */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
      >
        <h3 className="font-bold text-gray-800 mb-4 text-sm">توزيع المستخدمين حسب الدور</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={roleData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {roleData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip style={CHART_STYLE} formatter={(v, n) => [v, n]} />
            <Legend style={CHART_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bar — توزيع الصفوف */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
      >
        <h3 className="font-bold text-gray-800 mb-4 text-sm">الطلاب حسب الصف الدراسي</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={gradeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="grade" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip style={CHART_STYLE} />
            <Bar dataKey="count" name="عدد الطلاب" radius={[6, 6, 0, 0]}>
              {gradeData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Line — النشاط الشهري */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
      >
        <h3 className="font-bold text-gray-800 mb-4 text-sm">النشاط الشهري</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={MONTHLY_ACTIVITY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip style={CHART_STYLE} />
            <Legend style={CHART_STYLE} />
            <Line type="monotone" dataKey="posts"      name="منشورات"  stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="challenges" name="تحديات"   stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

    </div>
  );
}
