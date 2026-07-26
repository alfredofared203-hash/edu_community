import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Trophy, Plus, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null); // "userId-rewardId"

  useEffect(() => {
    Promise.all([api.getRewards(), api.getUsersWithRewards()])
      .then(([rRes, uRes]) => {
        setRewards(rRes?.data?.rewards || rRes?.rewards || []);
        setUsers(uRes?.data?.users || uRes?.users || []);
      })
      .catch((e) => setError(e.message || "تعذّر تحميل البيانات"))
      .finally(() => setLoading(false));
  }, []);

  const hasReward = (user, rewardId) =>
    (user.rewards || []).some((r) => (r.id || r.rewardId) === rewardId);

  const handleGrant = async (userId, rewardId) => {
    const key = `${userId}-${rewardId}`;
    setBusy(key);
    try {
      await api.grantReward(userId, rewardId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, rewards: [...(u.rewards || []), { id: rewardId, rewardId }] }
            : u
        )
      );
      toast.success("تم منح المكافأة");
    } catch (e) {
      toast.error(e.message || "فشل المنح");
    } finally {
      setBusy(null);
    }
  };

  const handleRevoke = async (userId, rewardId) => {
    const key = `${userId}-${rewardId}`;
    setBusy(key);
    try {
      await api.revokeReward(userId, rewardId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, rewards: (u.rewards || []).filter((r) => (r.id || r.rewardId) !== rewardId) }
            : u
        )
      );
      toast.success("تم إلغاء المكافأة");
    } catch (e) {
      toast.error(e.message || "فشل الإلغاء");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-right" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-50 rounded-2xl text-amber-500"><Trophy size={26} /></div>
        <div>
          <h1 className="text-xl font-black text-gray-800">إدارة المكافآت</h1>
          <p className="text-sm text-gray-500">منح أو إلغاء المكافآت للطلاب</p>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-400">جاري التحميل...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs">
                <th className="p-4 font-semibold">الطالب</th>
                {rewards.map((r) => (
                  <th key={r.id} className="p-4 font-semibold text-center whitespace-nowrap">
                    {r.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 && (
                <tr>
                  <td colSpan={rewards.length + 1} className="text-center py-8 text-gray-400">
                    لا يوجد مستخدمون.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-800 whitespace-nowrap">
                    {user.name}
                    <span className="block text-xs text-gray-400 font-normal">{user.email}</span>
                  </td>
                  {rewards.map((reward) => {
                    const earned = hasReward(user, reward.id);
                    const key = `${user.id}-${reward.id}`;
                    return (
                      <td key={reward.id} className="p-4 text-center">
                        {earned ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50 h-7 px-2"
                            disabled={busy === key}
                            onClick={() => handleRevoke(user.id, reward.id)}
                          >
                            <X size={14} className="ml-1" />
                            إلغاء
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:bg-green-50 h-7 px-2"
                            disabled={busy === key}
                            onClick={() => handleGrant(user.id, reward.id)}
                          >
                            <Plus size={14} className="ml-1" />
                            منح
                          </Button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
