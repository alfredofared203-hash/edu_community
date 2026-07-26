import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";

// ── بيانات وهمية للعرض (تُستبدل بالـ API لاحقاً) ──────────────────────────
const MOCK_BADGES_EARNED = [
  { id: 1, emoji: "🧮", title: "عبقري الرياضيات", date: "12 / 2023", bg: "bg-amber-50", border: "border-amber-200" },
  { id: 2, emoji: "💬", title: "مشارك نشط",       date: "05 / 2023", bg: "bg-emerald-50", border: "border-emerald-200" },
  { id: 3, emoji: "⏰", title: "الطائر المبكر",   date: "18 / 2023", bg: "bg-blue-50",    border: "border-blue-200" },
];
const MOCK_BADGES_LOCKED = [
  { id: 4, emoji: "🧠", title: "المفكر الناقد",  req: "مطلوب: 50 مشاركة" },
  { id: 5, emoji: "💡", title: "مبتكر حلول",     req: "مطلوب: فوز بمسابقة" },
];
const MOCK_STORE = [
  { id: 1, img: img1, title: "ندوة حصرية مع خبراء",      desc: "وصول مباشر لندوة تفاعلية مع كبار المتخصصين في مجالك.", cost: 1500 },
  { id: 2, img: img2, title: "إطار ملف شخصي مميز",       desc: "تميز بين زملائك بإطار متوهج وحصري لصورتك الشخصية.",   cost: 250  },
  { id: 3, img: img3, title: "شهادة رقمية معتمدة",        desc: "وثق مهاراتك بشهادة رقمية قابلة للمشاركة على لينكد إن.", cost: 500 },
];
const MOCK_LEADERBOARD = [
  { rank: 12, name: "ياسين إبراهيم", xp: 1340, avatar: "https://i.pravatar.cc/150?img=11", isMe: false },
  { rank: 13, name: "سارة محمود",    xp: 1295, avatar: "https://i.pravatar.cc/150?img=5",  isMe: false },
  { rank: 14, name: "أنت",           xp: 1250, avatar: null,                                isMe: true  },
  { rank: 15, name: "عمر خالد",      xp: 1180, avatar: "https://i.pravatar.cc/150?img=9",  isMe: false },
];
const MOCK_TIMELINE = [
  { color: "bg-blue-600",   icon: "✓", title: 'تم الحصول على شارة "الطائر المبكر"',  sub: "منذ يومين - دخول 5 أيام متتالية قبل الثامنة صباحاً" },
  { color: "bg-emerald-600",icon: "⭐", title: "الوصول للمستوى 5",                    sub: "منذ أسبوع - الحصول على 1000 نقطة خبرة" },
  { color: "bg-amber-600",  icon: "🏆", title: 'تم الحصول على شارة "مشارك نشط"',     sub: "منذ 10 أيام - المساهمة بـ 20 تعليقاً مفيداً" },
];
// ──────────────────────────────────────────────────────────────────────────────

export default function RewardsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allRewards, setAllRewards] = useState([]);
  const [myRewards,  setMyRewards]  = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([api.getRewards(), api.getMyRewards()])
      .then(([allRes, myRes]) => {
        setAllRewards(allRes?.data?.rewards || allRes?.rewards || []);
        setMyRewards(myRes?.data?.rewards  || myRes?.rewards  || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myXP      = user?.points || 1250;
  const badgeCount = myRewards.length || MOCK_BADGES_EARNED.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 text-right" dir="rtl">

      {/* ── هيدر ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm gap-4 border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المكافآت والشارات</h1>
          <p className="text-slate-500 text-sm mt-1">احتفل بإنجازاتك وحوّل نقاط خبرتك إلى مكافآت حصرية.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <StatChip color="amber"   icon="⭐" label="إجمالي XP"        value={myXP.toLocaleString("ar-EG")} />
          <StatChip color="emerald" icon="🛡️" label="شارة مكتسبة"     value={badgeCount} />
          <StatChip color="blue"    icon="🏆" label="الترتيب بالمدرسة" value="#14" />
        </div>
      </div>

      {/* ── شبكة رئيسية ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── المحتوى الرئيسي ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* شاراتي التعليمية */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">شاراتي التعليمية</h3>
              <span className="text-blue-600 text-sm font-semibold cursor-pointer hover:underline">عرض الكل</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {MOCK_BADGES_EARNED.map((b) => (
                <div key={b.id} className={`border ${b.border} ${b.bg} p-4 rounded-2xl flex flex-col items-center text-center gap-2`}>
                  <div className={`w-14 h-14 rounded-full bg-white border ${b.border} flex items-center justify-center text-2xl shadow-sm`}>
                    {b.emoji}
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">{b.title}</h4>
                  <p className="text-[10px] text-slate-400">{b.date}</p>
                </div>
              ))}
              {MOCK_BADGES_LOCKED.map((b) => (
                <div key={b.id} className="border border-dashed border-slate-200 p-4 rounded-2xl flex flex-col items-center text-center gap-2 relative opacity-70">
                  <span className="absolute top-2 left-2 text-xs">🔒</span>
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                    {b.emoji}
                  </div>
                  <h4 className="font-bold text-sm text-slate-700">{b.title}</h4>
                  <p className="text-[10px] text-rose-500 font-semibold">{b.req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* متجر المكافآت */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">متجر المكافآت</h3>
              <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                ⭐ {myXP.toLocaleString("ar-EG")} XP
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MOCK_STORE.map((item) => {
                const canAfford = myXP >= item.cost;
                return (
                  <div key={item.id} className="border border-slate-100 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition">
                    <div className="h-36 relative overflow-hidden">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-3 right-3 bg-black/60 text-amber-400 font-bold px-2.5 py-0.5 rounded-full text-xs">
                        ⭐ {item.cost.toLocaleString("ar-EG")} XP
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow gap-2">
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed flex-grow">{item.desc}</p>
                      <button
                        disabled={!canAfford}
                        className={`w-full mt-2 font-bold py-2 rounded-xl text-sm transition ${
                          canAfford
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {canAfford ? "استبدال الآن" : "نقاط غير كافية"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── عمود جانبي ── */}
        <div className="lg:col-span-1 space-y-5">

          {/* أحدث الإنجازات */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">أحدث الإنجازات</h3>
            <div className="space-y-4 text-sm relative before:absolute before:right-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {MOCK_TIMELINE.map((t, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full ${t.color} text-white flex items-center justify-center z-10 text-xs shrink-0`}>
                    {t.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ترتيبك بالمدرسة */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">ترتيبك بالمدرسة</h3>
            <div className="space-y-2">
              {MOCK_LEADERBOARD.map((u) => (
                <div
                  key={u.rank}
                  className={`flex items-center justify-between p-2 rounded-xl ${
                    u.isMe ? "bg-blue-50 border border-blue-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm w-5 text-center ${u.isMe ? "text-blue-600" : "text-slate-400"}`}>
                      {u.rank}
                    </span>
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {user?.name?.charAt(0) || "أ"}
                      </div>
                    )}
                    <div>
                      <span className={`text-sm font-semibold block ${u.isMe ? "text-blue-900" : "text-slate-700"}`}>
                        {u.isMe ? (user?.name || "أنت") : u.name}
                      </span>
                      {u.isMe && <span className="text-[10px] text-blue-500">(أنت)</span>}
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${u.isMe ? "text-blue-600 bg-white px-2 py-1 rounded-lg shadow-sm" : "text-slate-400"}`}>
                    {u.xp.toLocaleString("ar-EG")} XP
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/leaderboard")}
              className="w-full mt-4 border border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition"
            >
              مشاهدة القائمة كاملة
            </button>
          </div>

          {/* تحدي المجموعات */}
          <div className="bg-gradient-to-br from-teal-800 to-teal-950 text-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">تحدي المجموعات</h3>
            <p className="text-xs text-teal-100 leading-relaxed mb-4">
              ساعد فريقك في حل المسابقة الأسبوعية للحصول على ٢٠٠ نقطة إضافية.
            </p>
            <button className="bg-emerald-400 hover:bg-emerald-300 text-teal-950 font-bold px-4 py-2 rounded-xl text-sm w-full transition">
              انضم للفريق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatChip({ color, icon, label, value }) {
  const colors = {
    amber:   "bg-amber-50 border-amber-200 text-amber-600",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
    blue:    "bg-blue-50 border-blue-200 text-blue-600",
  };
  const iconBg = {
    amber:   "bg-amber-500",
    emerald: "bg-emerald-500",
    blue:    "bg-blue-500",
  };
  return (
    <div className={`border px-4 py-2 rounded-xl flex items-center gap-3 ${colors[color]}`}>
      <div className={`${iconBg[color]} text-white p-2 rounded-lg text-sm`}>{icon}</div>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className={`text-lg font-bold ${colors[color].split(" ").pop()}`}>{value}</div>
      </div>
    </div>
  );
}
