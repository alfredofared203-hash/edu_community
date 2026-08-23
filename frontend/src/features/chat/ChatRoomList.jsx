import { useEffect, useMemo, useState } from "react";
import { Search, Users, GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { GRADES, gradeLabel } from "../../lib/grades";
import { api } from "../../lib/api";

const TABS = [
  { id: "groups", label: "مجموعات", icon: Users },
  { id: "teachers", label: "المعلمون", icon: GraduationCap },
];

function initials(name = "?") { return name.trim().charAt(0) || "?"; }

export default function ChatRoomList({ activeRoom, onSelect }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("groups");
  const [query, setQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tab !== "teachers") return;
    api.getTeachers().then((data) => setTeachers(data?.teachers || data || [])).catch((err) => setError(err.message));
  }, [tab]);

  const rooms = useMemo(() => {
    if (!user) return [];
    if (tab === "teachers") {
      return teachers
        .filter((teacher) => user.role !== "student" || !teacher.grade || teacher.grade === user.grade)
        .filter((teacher) => user.role !== "teacher" || String(teacher.id || teacher._id) === String(user.id || user._id))
        .map((teacher) => ({ id: `teacher:${teacher.id || teacher._id}:${user.grade}`, name: teacher.name }));
    }
    const grades = user.role === "student" ? [user.grade] : GRADES.map((grade) => grade.value);
    return grades.filter(Boolean).map((grade) => ({ id: `group:${grade}`, name: `شات ${gradeLabel(grade)}` }));
  }, [tab, teachers, user]);

  const filtered = rooms.filter((room) => room.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <aside className="w-80 shrink-0 border-l border-gray-100 bg-white h-full flex flex-col" dir="rtl">
      <div className="p-4 border-b border-gray-50 space-y-4">
        <div className="relative"><Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-4 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="بحث في المحادثات..." className="w-full bg-[#F4F6F9] text-sm text-gray-700 rounded-2xl py-3 pr-10 pl-4 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
        <div className="flex bg-[#F4F6F9] p-1 rounded-xl gap-1">{TABS.map((tabItem) => { const Icon = tabItem.icon; return <button key={tabItem.id} onClick={() => { setTab(tabItem.id); setError(null); }} className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${tab === tabItem.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}><Icon className="w-3.5 h-3.5" />{tabItem.label}</button>; })}</div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50/60">
        {error && <p className="text-sm text-red-500 p-6 text-center">{error}</p>}
        {filtered.length === 0 ? <p className="text-sm text-gray-400 p-8 text-center">لا توجد محادثات في هذا القسم</p> : filtered.map((room) => <button key={room.id} onClick={() => onSelect(room.id, room)} className={`w-full p-4 flex items-center gap-3 text-right ${activeRoom === room.id ? "bg-blue-50 border-r-4 border-blue-600" : "hover:bg-gray-50"}`}><div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">{initials(room.name)}</div><div className="min-w-0"><h4 className="font-bold text-sm text-gray-800 truncate">{room.name}</h4><p className="text-xs text-gray-500">{tab === "teachers" ? "محادثة خاصة مع المدرس" : "محادثة الجروب الدراسي"}</p></div></button>)}
      </div>
    </aside>
  );
}
