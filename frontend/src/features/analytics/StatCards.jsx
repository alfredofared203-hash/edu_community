import { motion } from "framer-motion";
import { Users, GraduationCap, Trophy, FileText, Activity } from "lucide-react";

const CARDS = [
  { key: "students",   label: "إجمالي الطلاب",     icon: GraduationCap, color: "text-blue-600",   bg: "bg-blue-50"   },
  { key: "teachers",   label: "إجمالي المعلمين",    icon: Users,         color: "text-emerald-600",bg: "bg-emerald-50"},
  { key: "challenges", label: "تحديات نشطة",        icon: Trophy,        color: "text-amber-600",  bg: "bg-amber-50"  },
  { key: "posts",      label: "إجمالي المنشورات",   icon: FileText,      color: "text-indigo-600", bg: "bg-indigo-50" },
  { key: "total",      label: "إجمالي المستخدمين",  icon: Activity,      color: "text-rose-600",   bg: "bg-rose-50"   },
];

export default function StatCards({ stats }) {
  const values = {
    students:   stats?.usersByRole?.find((u) => u.role === "student")?.count  ?? 0,
    teachers:   stats?.usersByRole?.find((u) => u.role === "teacher")?.count  ?? 0,
    challenges: stats?.activeChallenges ?? 0,
    posts:      stats?.totalPosts       ?? 0,
    total:      stats?.usersByRole?.reduce((s, u) => s + Number(u.count), 0)  ?? 0,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {CARDS.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.color} flex items-center justify-center mb-3`}>
            <c.icon size={20} />
          </div>
          <p className="text-2xl font-black text-gray-800">{Number(values[c.key]).toLocaleString("ar-EG")}</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">{c.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
