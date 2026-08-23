import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { api } from "../../lib/api";

export default function SubmitPresentationDialog({ skill, open, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("اختر ملفاً أولاً");
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.submitPresentation(skill.id, fd);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "فشل الرفع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>رفع بريزنتيشن — {skill?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="pres-file">الملف (PDF / PPT / PPTX)</Label>
            <Input
              id="pres-file"
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>إلغاء</Button>
            <Button type="submit" disabled={loading}>{loading ? "جاري الرفع..." : "رفع"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
