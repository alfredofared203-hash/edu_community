const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth.middleware');
<<<<<<< HEAD
const upload = require('../middleware/upload.middleware');
=======
>>>>>>> backend2
const { getJwtSecret, getRefreshSecret } = require('../config/auth');

const router = express.Router();

// ===== التوكنات =====
// accessToken قصير (بيتبعت مع كل طلب) + refreshToken طويل (بيجيب access جديد).
function makeAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, grade: user.grade },
    getJwtSecret(),
    { expiresIn: '2h' }
  );
}

function makeRefreshToken(user) {
  return jwt.sign({ id: user._id, type: 'refresh' }, getRefreshSecret(), { expiresIn: '7d' });
}

// بنرجّع التوكنين مع بيانات المستخدم بالشكل اللي الفرونت متوقّعه
function authPayload(user) {
  return { user, accessToken: makeAccessToken(user), refreshToken: makeRefreshToken(user) };
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, grade, subject, schoolCode, nationalId } = req.body;
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const validRoles = ['student', 'teacher'];

    if (!normalizedName || !normalizedEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'الاسم والبريد وكلمة المرور مطلوبين' });
    }
    if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return res.status(400).json({ error: 'البريد الإلكتروني غير صحيح' });
    if (role && !validRoles.includes(role)) return res.status(400).json({ error: 'نوع الحساب غير صالح' });
    if ((role || 'student') === 'student' && !grade) return res.status(400).json({ error: 'المرحلة الدراسية مطلوبة للطالب' });

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ error: 'البريد مسجّل من قبل' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'student',
      grade,
      subject,
      schoolCode,
      nationalId,
    });

    res.status(201).json(authPayload(user));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });

    res.json(authPayload(user));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});

// تجديد الجلسة — الفرونت بينادي عليه لما الـaccessToken يخلص
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'الـ refresh token مطلوب' });

    let payload;
    try {
      payload = jwt.verify(refreshToken, getRefreshSecret());
    } catch (e) {
      return res.status(401).json({ error: 'انتهت الجلسة — سجّل دخول من جديد' });
    }
    if (payload.type !== 'refresh') return res.status(401).json({ error: 'توكن غير صالح' });

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'المستخدم غير موجود' });

    res.json(authPayload(user));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'حصل خطأ في السيرفر' });
  }
});

// تسجيل خروج (الفرونت بيمسح التوكن محلياً — ده مجرد رد ناجح)
router.post('/logout', (req, res) => res.json({ ok: true }));

router.get('/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
  res.json({ user });
});

<<<<<<< HEAD
router.patch('/profile', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });

    const { name, schoolCode, grade, nationalId, subject, avatarPosition, theme, language } = req.body;
    if (typeof name === 'string' && name.trim()) user.name = name.trim();
    if (typeof avatarPosition !== 'undefined') user.avatarPosition = Math.max(0, Math.min(100, Number(avatarPosition) || 50));
    if (req.file) user.avatarUrl = `/uploads/${req.file.filename}`;

    const roleSettings = user.roleSettings?.toObject?.() || user.roleSettings || {};
    if (user.role === 'student') {
      user.grade = grade ?? user.grade;
      user.schoolCode = schoolCode ?? user.schoolCode;
      user.nationalId = nationalId ?? user.nationalId;
      roleSettings.student = { grade: user.grade, schoolCode: user.schoolCode, nationalId: user.nationalId };
    } else if (user.role === 'teacher') {
      user.schoolCode = schoolCode ?? user.schoolCode;
      roleSettings.teacher = { subject: subject ?? '', schoolCode: user.schoolCode };
    } else if (user.role === 'admin') {
      user.schoolCode = schoolCode ?? user.schoolCode;
      roleSettings.admin = { schoolCode: user.schoolCode };
    }
    user.roleSettings = roleSettings;
    user.preferences = {
      ...(user.preferences?.toObject?.() || user.preferences || {}),
      ...(theme === 'dark' || theme === 'light' ? { theme } : {}),
      ...(language === 'ar' || language === 'en' ? { language } : {}),
    };
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message || 'تعذر حفظ إعدادات الملف الشخصي' });
  }
});

=======
>>>>>>> backend2
module.exports = router;
