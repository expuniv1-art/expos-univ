# EXPOS_UNIV — نسخة مربوطة مع Supabase

هذه نسخة React/Vite جاهزة للربط الحقيقي مع Supabase من أجل:

- تسجيل دخول الطلبة والمدير.
- حماية البيانات: كل طالب يرى ملفه فقط.
- لوحة مدير لتعديل حالة المشروع، نسبة التقدم، حالة الدفع، رفع الملفات، ونشر التحديثات.
- رفع وصول الدفع PDF من طرف الطالب.
- رفع ملفات Word / PDF / PowerPoint من طرف المدير.
- تحديثات مباشرة عبر Supabase Realtime.

---

## 1) إنشاء مشروع Supabase

1. افتح Supabase وأنشئ Project جديد.
2. ادخل إلى SQL Editor.
3. انسخ محتوى الملف:

```txt
supabase/schema.sql
```

ثم نفّذه داخل SQL Editor.

---

## 2) إنشاء حساب المدير والطلبة

من Supabase Dashboard:

Authentication → Users → Add user

أنشئ مثلاً:

```txt
admin@expos-univ.com
student@expos-univ.com
```

ثم انسخ UUID الخاص بكل مستخدم.

بعد ذلك نفّذ SQL مثل الآتي، مع تغيير UUID:

```sql
insert into public.profiles (id, email, full_name, role)
values ('ADMIN_USER_UUID', 'admin@expos-univ.com', 'Admin EXPOS_UNIV', 'admin');

insert into public.profiles (id, email, full_name, role)
values ('STUDENT_USER_UUID', 'student@expos-univ.com', 'أمينة بن يوسف', 'student');

insert into public.students (
  user_id,
  name,
  university,
  specialty,
  project_type,
  total_amount,
  project_status,
  progress,
  last_admin_update,
  delivery_date
)
values (
  'STUDENT_USER_UUID',
  'أمينة بن يوسف',
  'جامعة الجزائر 3',
  'علوم التسيير',
  'مذكرة ماستر',
  18000,
  'project_in_progress',
  25,
  'تم تسجيل المشروع بنجاح.',
  '2026-06-10'
);
```

---

## 3) ربط الموقع بمفاتيح Supabase

أنشئ ملفاً باسم:

```txt
.env.local
```

ثم ضع فيه:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
VITE_ADMIN_EMAILS=admin@expos-univ.com
```

تجد القيم في:

Supabase Dashboard → Project Settings → API

---

## 4) تشغيل الموقع محلياً

```bash
npm install
npm run dev
```

ثم افتح الرابط المحلي الذي يظهر لك، غالباً:

```txt
http://localhost:5173
```

---

## 5) رابط الطالب ورابط الإدارة

بعد النشر على Vercel أو Netlify سيكون لديك رابط مثل:

```txt
https://expos-univ.vercel.app
```

- رابط دخول الطلبة: `https://expos-univ.vercel.app`
- رابط لوحة الإدارة: `https://expos-univ.vercel.app/admin`

ملاحظة: لوحة الإدارة تظهر فقط إذا كان الحساب داخل جدول profiles بدور `admin`.

---

## 6) أين تغيّر معلومات الطالب لاحقاً؟

الأفضل تغيير المعلومات من داخل لوحة المدير في الموقع:

- حالة المشروع
- نسبة التقدم
- حالة الدفع
- التحديثات
- الملفات النهائية

أما بيانات مثل الجامعة، التخصص، نوع المشروع، المبلغ الكلي، وتاريخ التسليم، فتستطيع تعديلها من Supabase مباشرة في جدول:

```txt
public.students
```

يمكن لاحقاً إضافة صفحة داخل لوحة المدير لتعديل هذه البيانات أيضاً.

---

## 7) الجداول الأساسية

- `profiles`: صلاحيات المستخدمين Admin / Student.
- `students`: معلومات الطالب والمشروع.
- `payments`: سجل الدفعات ووصول الدفع.
- `project_files`: الملفات النهائية.
- `admin_updates`: تحديثات الإدارة.

---

## 8) التخزين

تم إنشاء Bucketين:

- `payment-receipts`: وصول الدفع PDF.
- `project-files`: ملفات Word / PDF / PowerPoint النهائية.

كل الملفات خاصة وليست Public.

---

## 9) الحماية

تم تفعيل Row Level Security على الجداول. الطالب يستطيع رؤية ملفه فقط وإضافة دفعاته فقط. المدير يستطيع رؤية وتعديل كل الطلبة.

---

## 10) النشر على Vercel

1. ارفع المشروع إلى GitHub.
2. افتح Vercel.
3. Import Project.
4. أضف Environment Variables نفسها الموجودة في `.env.local`.
5. Deploy.

بعد النشر ستحصل على رابط الموقع النهائي.
