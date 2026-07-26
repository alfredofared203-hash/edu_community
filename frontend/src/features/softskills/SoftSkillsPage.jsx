import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
<<<<<<< HEAD
=======
import { useAuth } from "../../context/AuthContext";
>>>>>>> 4802385 (alaa)
import SkillCard from "./SkillCard";
import SideCards from "./SideCards";

export default function SoftSkillsPage() {
<<<<<<< HEAD
=======
  const { user } = useAuth();
>>>>>>> 4802385 (alaa)
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

<<<<<<< HEAD
  // نجيب المهارات الحقيقية من الباك (مش mock)
  useEffect(() => {
    api
      .getSoftSkills()
      .then((res) => {
        // شكل الرد: { success, data: { skills } }
        const list = res?.data?.skills || res?.skills || [];
        // نحوّل بيانات الـAPI للشكل اللي الكارت متوقّعه
=======
  useEffect(() => {
    api.getSoftSkills()
      .then((res) => {
        const list = res?.data?.skills || res?.skills || [];
>>>>>>> 4802385 (alaa)
        const mapped = list.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon || "HelpCircle",
          color: s.color || "blue",
          coursesCount: s.coursesCount || 0,
<<<<<<< HEAD
          // درجة الطالب في المهارة (لو موجودة) بتبقى نسبة التقدّم
          progress: typeof s.myGrade === "number" ? s.myGrade : 0,
          actionText: "ابدأ الآن ←",
=======
          progress: typeof s.myGrade === "number" ? s.myGrade : 0,
          myGrade: typeof s.myGrade === "number" ? s.myGrade : null,
          actionText: "ارفع بريزنتيشن ←",
>>>>>>> 4802385 (alaa)
        }));
        setSkills(mapped);
      })
      .catch((e) => setError(e.message || "تعذّر تحميل المهارات"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto bg-[#F9FAFC] min-h-screen text-right" dir="rtl">
<<<<<<< HEAD

      <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[160px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full opacity-40 transform translate-x-10 -translate-y-10"></div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-3">
          طور مهاراتك لمستقبل أفضل
        </h1>
=======
      <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[160px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full opacity-40 transform translate-x-10 -translate-y-10"></div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-3">طور مهاراتك لمستقبل أفضل</h1>
>>>>>>> 4802385 (alaa)
        <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-3xl font-medium">
          اكتشف قوة المهارات الناعمة في تحويل مسارك المهني والأكاديمي. نحن نركز على تمكينك
          من خلال تطوير التواصل، القيادة، وإدارة الوقت لضمان تميزك في سوق العمل الحديث وبناء
          علاقات اجتماعية ناجحة.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
<<<<<<< HEAD

=======
>>>>>>> 4802385 (alaa)
        <div className="flex-1 order-2 lg:order-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-800">استكشف المهارات الأساسية</h2>
          </div>

<<<<<<< HEAD
          {/* حالات التحميل والخطأ والفراغ */}
=======
>>>>>>> 4802385 (alaa)
          {loading && <p className="text-sm text-gray-400 mb-6">جاري تحميل المهارات...</p>}
          {error && <p className="text-sm text-red-500 mb-6">{error}</p>}
          {!loading && !error && skills.length === 0 && (
            <p className="text-sm text-gray-400 mb-6">لا توجد مهارات بعد.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {skills.map((skill) => (
<<<<<<< HEAD
              <SkillCard key={skill.id} skill={skill} />
=======
              <SkillCard key={skill.id} skill={skill} role={user?.role} />
>>>>>>> 4802385 (alaa)
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SideCards />
        </div>
<<<<<<< HEAD

=======
>>>>>>> 4802385 (alaa)
      </div>
    </div>
  );
}
