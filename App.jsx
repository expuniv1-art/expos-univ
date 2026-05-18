import { supabase } from './supabaseClient'
  import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  Upload,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { supabase } from './supabaseClient';

const projectStatuses = [
  ['not_started', 'لم يبدأ بعد', 'Pas encore commencé', 0],
  ['project_in_progress', 'المشروع قيد الإنجاز', 'Projet en cours', 25],
  ['chapter_one_done', 'تم إنهاء الفصل الأول', 'Chapitre 1 terminé', 50],
  ['chapter_two_done', 'تم إنهاء الفصل الثاني', 'Chapitre 2 terminé', 60],
  ['review_correction', 'التصحيح والمراجعة', 'Correction et révision', 75],
  ['references_done', 'تم إنهاء التهميش والمراجع', 'Références finalisées', 80],
  ['powerpoint_done', 'تم إنهاء PowerPoint', 'PowerPoint terminé', 90],
  ['project_completed', 'المشروع مكتمل', 'Projet complet', 100],
  ['sent_to_student', 'تم إرسال المشروع للطالب', 'Projet envoyé', 100],
].map(([value, ar, fr, progress]) => ({ value, ar, fr, progress }));

const paymentStatuses = [
  ['paid', 'مدفوع', 'Payé'],
  ['partial', 'دفع جزئي', 'Paiement partiel'],
  ['pending', 'قيد الانتظار', 'En attente'],
].map(([value, ar, fr]) => ({ value, ar, fr }));

const dict = {
  ar: {
    brand: 'EXPOS_UNIV',
    subtitle: 'منصة جامعية احترافية لمتابعة مشاريع الطلبة الجزائريين',
    loginTitle: 'تسجيل الدخول إلى المنصة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    login: 'دخول',
    logout: 'خروج',
    dashboard: 'لوحة التحكم',
    students: 'الطلبة',
    payments: 'الدفعات',
    files: 'الملفات',
    updates: 'تحديثات الإدارة',
    security: 'الحماية',
    adminPanel: 'لوحة تحكم المدير',
    admin: 'المدير',
    student: 'الطالب',
    welcome: 'مرحباً،',
    university: 'الجامعة',
    specialty: 'التخصص',
    projectType: 'نوع المشروع',
    paymentStatus: 'حالة الدفع',
    totalAmount: 'المبلغ الكلي',
    paidAmount: 'المبلغ المدفوع',
    remainingAmount: 'المبلغ المتبقي',
    projectStatus: 'حالة المشروع',
    progress: 'نسبة التقدم',
    lastUpdate: 'آخر تحديث من الإدارة',
    deliveryDate: 'تاريخ التسليم',
    selectStudent: 'اختيار الطالب',
    updateProject: 'تعديل حالة المشروع',
    updatePayment: 'تعديل حالة الدفع',
    updateProgress: 'تعديل نسبة التقدم',
    addPayment: 'إضافة دفعة جديدة',
    amount: 'مبلغ الدفعة',
    paymentDate: 'تاريخ الدفع',
    receipt: 'وصل الدفع PDF',
    savePayment: 'حفظ الدفعة',
    paymentHistory: 'سجل الدفعات',
    date: 'التاريخ',
    receiptFile: 'وصل الدفع',
    uploadFinalFile: 'رفع ملف نهائي',
    fileName: 'اسم الملف',
    fileType: 'نوع الملف',
    addFile: 'إضافة الملف',
    finalFiles: 'الملفات النهائية',
    download: 'تحميل',
    writeUpdate: 'كتابة تحديث إداري',
    publishUpdate: 'نشر التحديث',
    noFiles: 'لا توجد ملفات حالياً.',
    noUpdates: 'لا توجد تحديثات حالياً.',
    language: 'Français',
    loginError: 'تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.',
    loading: 'جاري تحميل البيانات...',
    saveError: 'حدث خطأ أثناء الحفظ. تحقق من إعدادات Supabase والصلاحيات.',
    secureNote: 'كل طالب يرى ملفه فقط. المدير وحده يستطيع تعديل حالة المشروع، الملفات، حالة الدفع ونسبة التقدم.',
    realtimeNote: 'التحديثات تظهر مباشرة بفضل Supabase Realtime بعد تفعيل الجداول في قاعدة البيانات.',
    adminRights: 'من هنا تستطيع إدارة الطلبة، الدفعات، الحالات، التحديثات والملفات النهائية.',
    studentRights: 'الطالب يستطيع فقط إضافة دفعة ورفع وصل PDF. لا يستطيع تعديل معلومات المشروع.',
  },
  fr: {
    brand: 'EXPOS_UNIV',
    subtitle: 'Plateforme universitaire professionnelle pour le suivi des projets des étudiants algériens',
    loginTitle: 'Connexion à la plateforme',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    login: 'Se connecter',
    logout: 'Déconnexion',
    dashboard: 'Tableau de bord',
    students: 'Étudiants',
    payments: 'Paiements',
    files: 'Fichiers',
    updates: 'Mises à jour',
    security: 'Sécurité',
    adminPanel: 'Espace administrateur',
    admin: 'Administrateur',
    student: 'Étudiant',
    welcome: 'Bienvenue,',
    university: 'Université',
    specialty: 'Spécialité',
    projectType: 'Type de projet',
    paymentStatus: 'État du paiement',
    totalAmount: 'Montant total',
    paidAmount: 'Montant payé',
    remainingAmount: 'Reste à payer',
    projectStatus: 'État du projet',
    progress: 'Progression',
    lastUpdate: 'Dernière mise à jour',
    deliveryDate: 'Date de livraison',
    selectStudent: 'Sélectionner un étudiant',
    updateProject: 'Modifier l’état du projet',
    updatePayment: 'Modifier l’état du paiement',
    updateProgress: 'Modifier la progression',
    addPayment: 'Ajouter un paiement',
    amount: 'Montant',
    paymentDate: 'Date du paiement',
    receipt: 'Reçu PDF',
    savePayment: 'Enregistrer',
    paymentHistory: 'Historique des paiements',
    date: 'Date',
    receiptFile: 'Reçu',
    uploadFinalFile: 'Ajouter un fichier final',
    fileName: 'Nom du fichier',
    fileType: 'Type du fichier',
    addFile: 'Ajouter',
    finalFiles: 'Fichiers finaux',
    download: 'Télécharger',
    writeUpdate: 'Rédiger une mise à jour',
    publishUpdate: 'Publier',
    noFiles: 'Aucun fichier pour le moment.',
    noUpdates: 'Aucune mise à jour pour le moment.',
    language: 'العربية',
    loginError: 'Connexion impossible. Vérifiez vos identifiants.',
    loading: 'Chargement des données...',
    saveError: 'Erreur lors de l’enregistrement. Vérifiez Supabase et les politiques RLS.',
    secureNote: 'Chaque étudiant voit uniquement son dossier. Seul l’administrateur modifie les statuts, fichiers, paiements et progressions.',
    realtimeNote: 'Les changements apparaissent directement grâce à Supabase Realtime après activation des tables.',
    adminRights: 'Gérez les étudiants, paiements, statuts, mises à jour et fichiers finaux.',
    studentRights: 'L’étudiant peut seulement ajouter un paiement et déposer un reçu PDF.',
  },
};

function money(value) {
  return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function label(list, value, lang) {
  return list.find((item) => item.value === value)?.[lang] || value;
}

function statusClass(status) {
  if (['paid', 'project_completed', 'sent_to_student'].includes(status)) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  if (['partial', 'project_in_progress', 'chapter_one_done', 'chapter_two_done', 'review_correction', 'references_done', 'powerpoint_done'].includes(status)) return 'bg-blue-50 text-blue-700 ring-blue-200';
  return 'bg-amber-50 text-amber-700 ring-amber-200';
}

function Card({ children, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </motion.div>
  );
}

function IconBox({ children }) {
  return <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">{children}</div>;
}

function Badge({ children, status }) {
  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass(status)}`}><span className="h-2 w-2 rounded-full bg-current" />{children}</span>;
}

function Progress({ value }) {
  const v = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-black text-slate-700"><span>{v}%</span><span>0 / 25 / 50 / 75 / 100</span></div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
        <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-slate-950" />
      </div>
    </div>
  );
}

function Login({ lang, setLang, onLogin, error }) {
  const t = dict[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.45),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.11),transparent_35%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-2 lg:px-10">
        <section className="space-y-7">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur"><GraduationCap className="h-5 w-5 text-blue-300" />{t.brand}</div>
          <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">منصة احترافية لمتابعة مشاريع الطلبة والدفع والملفات النهائية.</h1>
          <p className="max-w-xl text-lg leading-8 text-slate-300">{t.subtitle}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[ShieldCheck, Bell, FileText].map((Icon, i) => <div key={i} className="rounded-3xl border border-white/10 bg-white/10 p-4"><Icon className="mb-3 h-6 w-6 text-blue-300" /><p className="text-sm font-bold">Supabase Ready</p></div>)}
          </div>
        </section>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div><h2 className="text-2xl font-black">{t.loginTitle}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Supabase Auth + RLS</p></div>
            <button type="button" onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')} className="rounded-2xl border border-slate-200 p-3"><Languages className="h-5 w-5" /></button>
          </div>
          <label className="mb-4 block"><span className="mb-2 block text-sm font-bold text-slate-600">{t.email}</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><Mail className="h-5 w-5 text-slate-400" /><input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" placeholder="admin@expos-univ.com" /></div></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-slate-600">{t.password}</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><Lock className="h-5 w-5 text-slate-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none" placeholder="••••••••" /></div></label>
          <AnimatePresence>{error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</motion.p>}</AnimatePresence>
          <button className="mt-6 w-full rounded-2xl bg-blue-700 px-5 py-4 font-black text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800">{t.login}</button>
        </form>
      </div>
    </main>
  );
}

function Sidebar({ lang, role, active, setActive, logout, open, setOpen }) {
  const t = dict[lang];
  const items = [
    ['dashboard', t.dashboard, LayoutDashboard],
    ...(role === 'admin' ? [['students', t.students, Users]] : []),
    ['payments', t.payments, CreditCard],
    ['files', t.files, FileText],
    ['updates', t.updates, Bell],
    ['security', t.security, ShieldCheck],
  ];
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 z-40 w-80 bg-slate-950 p-4 text-white transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : lang === 'ar' ? 'translate-x-full' : '-translate-x-full'} ${lang === 'ar' ? 'right-0' : 'left-0'}`}>
        <div className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-8 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600"><GraduationCap /></div><div><p className="text-lg font-black">{t.brand}</p><p className="text-xs text-slate-400">{role === 'admin' ? t.admin : t.student}</p></div></div><button onClick={() => setOpen(false)} className="lg:hidden"><X /></button></div>
          <nav className="space-y-2">{items.map(([key, text, Icon]) => <button key={key} onClick={() => { setActive(key); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${active === key ? 'bg-blue-600' : 'text-slate-300 hover:bg-white/10'}`}><Icon className="h-5 w-5" />{text}</button>)}</nav>
          <div className="mt-auto space-y-3"><p className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">{t.realtimeNote}</p><button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 font-bold hover:bg-white/10"><LogOut className="h-5 w-5" />{t.logout}</button></div>
        </div>
      </aside>
    </>
  );
}

function Header({ lang, setLang, profile, student, openMenu }) {
  const t = dict[lang];
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur lg:px-8"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><button onClick={openMenu} className="rounded-2xl border border-slate-200 bg-white p-3 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-sm font-bold text-slate-500">{t.welcome}</p><h1 className="text-xl font-black sm:text-2xl">{profile?.role === 'admin' ? t.adminPanel : student?.name || profile?.full_name}</h1></div></div><div className="flex items-center gap-3"><button onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')} className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold sm:flex"><Languages className="h-5 w-5" />{t.language}</button><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><UserRound className="h-5 w-5" /></div><div className="hidden sm:block"><p className="text-sm font-black">{profile?.full_name}</p><p className="text-xs text-slate-500">{profile?.email}</p></div></div></div></div></header>;
}

function AdminControls({ lang, students, selectedId, setSelectedId, student, updateStudent }) {
  const t = dict[lang];
  const updateStatus = (value) => {
    const status = projectStatuses.find((s) => s.value === value);
    updateStudent(student.id, { project_status: value, progress: status?.progress ?? student.progress, last_admin_update: label(projectStatuses, value, lang) });
  };
  return <Card><div className="mb-5 flex items-center gap-3"><IconBox><Users className="h-5 w-5" /></IconBox><div><h2 className="text-xl font-black">{t.adminPanel}</h2><p className="text-sm text-slate-500">{t.adminRights}</p></div></div><div className="grid gap-4 lg:grid-cols-4"><Select label={t.selectStudent} value={selectedId} onChange={setSelectedId}>{students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select><Select label={t.updateProject} value={student.project_status} onChange={updateStatus}>{projectStatuses.map((s) => <option key={s.value} value={s.value}>{s[lang]}</option>)}</Select><Select label={t.updatePayment} value={student.payment_status} onChange={(v) => updateStudent(student.id, { payment_status: v })}>{paymentStatuses.map((s) => <option key={s.value} value={s.value}>{s[lang]}</option>)}</Select><Select label={t.updateProgress} value={student.progress} onChange={(v) => updateStudent(student.id, { progress: Number(v) })}>{[0, 25, 50, 75, 100].map((v) => <option key={v} value={v}>{v}%</option>)}</Select></div></Card>;
}

function Select({ label: title, value, onChange, children }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-600">{title}</span><select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500">{children}</select></label>;
}

function Dashboard({ lang, student }) {
  const t = dict[lang];
  const remaining = Number(student.total_amount || 0) - Number(student.paid_amount || 0);
  const stats = [[t.totalAmount, money(student.total_amount), CreditCard], [t.paidAmount, money(student.paid_amount), CheckCircle2], [t.remainingAmount, money(remaining), AlertCircle], [t.deliveryDate, student.delivery_date || '-', CalendarDays]];
  const info = [[t.university, student.university, Building2], [t.specialty, student.specialty, BookOpen], [t.projectType, student.project_type, GraduationCap]];
  return <><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map(([k, v, Icon]) => <Card key={k}><div className="flex justify-between gap-3"><div><p className="text-sm font-bold text-slate-500">{k}</p><p className="mt-2 text-2xl font-black">{v}</p></div><IconBox><Icon className="h-5 w-5" /></IconBox></div></Card>)}</div><div className="grid gap-5 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="mb-5 flex items-center gap-3"><IconBox><LayoutDashboard className="h-5 w-5" /></IconBox><h2 className="text-xl font-black">{t.dashboard}</h2></div><div className="grid gap-3 sm:grid-cols-2">{info.map(([k, v, Icon]) => <div key={k} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-500"><Icon className="h-4 w-4" />{k}</div><p className="font-black">{v}</p></div>)}<div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="mb-2 text-sm font-bold text-slate-500">{t.paymentStatus}</p><Badge status={student.payment_status}>{label(paymentStatuses, student.payment_status, lang)}</Badge></div><div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="mb-2 text-sm font-bold text-slate-500">{t.projectStatus}</p><Badge status={student.project_status}>{label(projectStatuses, student.project_status, lang)}</Badge></div></div></Card><Card><div className="mb-6 flex items-center gap-3"><IconBox><CheckCircle2 className="h-5 w-5" /></IconBox><div><h2 className="text-xl font-black">{t.progress}</h2><p className="text-sm text-slate-500">{label(projectStatuses, student.project_status, lang)}</p></div></div><Progress value={student.progress} /><div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white"><p className="mb-2 text-sm font-bold text-blue-200">{t.lastUpdate}</p><p className="leading-7">{student.last_admin_update || '-'}</p></div></Card></div></>;
}

function Payments({ lang, student, payments, addPayment, role }) {
  const t = dict[lang];
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState(null);
  const sorted = [...payments].sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date));
  let running = 0;
  return <div className="grid gap-5 xl:grid-cols-3">{role === 'student' && <Card><div className="mb-5 flex items-center gap-3"><IconBox><Upload className="h-5 w-5" /></IconBox><h2 className="text-xl font-black">{t.addPayment}</h2></div><form onSubmit={(e) => { e.preventDefault(); addPayment({ amount: Number(amount), payment_date: date, file }); setAmount(''); setFile(null); }} className="space-y-4"><Input label={t.amount} type="number" value={amount} onChange={setAmount} /><Input label={t.paymentDate} type="date" value={date} onChange={setDate} /><label className="block"><span className="mb-2 block text-sm font-bold text-slate-600">{t.receipt}</span><input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm" /></label><button className="w-full rounded-2xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800">{t.savePayment}</button></form></Card>}<Card className={role === 'student' ? 'xl:col-span-2' : 'xl:col-span-3'}><div className="mb-5 flex items-center gap-3"><IconBox><CreditCard className="h-5 w-5" /></IconBox><h2 className="text-xl font-black">{t.paymentHistory}</h2></div><div className="overflow-hidden rounded-3xl border border-slate-200"><div className="grid grid-cols-4 bg-slate-950 px-4 py-3 text-sm font-black text-white"><span>{t.date}</span><span>{t.amount}</span><span>{t.receiptFile}</span><span>{t.remainingAmount}</span></div>{sorted.map((p) => { running += Number(p.amount); return <div key={p.id} className="grid grid-cols-4 items-center gap-3 border-t border-slate-100 px-4 py-4 text-sm"><span className="font-bold">{p.payment_date}</span><span className="font-black">{money(p.amount)}</span><span className="truncate text-blue-700">{p.receipt_name}</span><span className="font-bold">{money(Math.max(0, Number(student.total_amount) - running))}</span></div>; })}</div></Card></div>;
}

function Input({ label: title, value, onChange, type = 'text', placeholder = '' }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-600">{title}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" /></label>;
}

function Files({ lang, student, files, uploadFile, downloadFile, role }) {
  const t = dict[lang];
  const [fileType, setFileType] = useState('PDF');
  const [file, setFile] = useState(null);
  return <div className="grid gap-5 xl:grid-cols-3">{role === 'admin' && <Card><div className="mb-5 flex items-center gap-3"><IconBox><Upload className="h-5 w-5" /></IconBox><h2 className="text-xl font-black">{t.uploadFinalFile}</h2></div><form onSubmit={(e) => { e.preventDefault(); uploadFile({ file, file_type: fileType }); setFile(null); }} className="space-y-4"><Select label={t.fileType} value={fileType} onChange={setFileType}><option>Word</option><option>PDF</option><option>PowerPoint</option></Select><label className="block"><span className="mb-2 block text-sm font-bold text-slate-600">{t.fileName}</span><input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm" /></label><button className="w-full rounded-2xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800">{t.addFile}</button></form></Card>}<Card className={role === 'admin' ? 'xl:col-span-2' : 'xl:col-span-3'}><div className="mb-5 flex items-center gap-3"><IconBox><FileText className="h-5 w-5" /></IconBox><h2 className="text-xl font-black">{t.finalFiles}</h2></div>{files.length === 0 ? <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">{t.noFiles}</p> : <div className="grid gap-3">{files.map((f) => <div key={f.id} className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700"><FileText /></div><div><p className="font-black">{f.name}</p><p className="text-sm text-slate-500">{f.file_type} • {new Date(f.created_at).toLocaleDateString()}</p></div></div><button onClick={() => downloadFile(f)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"><Download className="h-4 w-4" />{t.download}</button></div>)}</div>}</Card></div>;
}

function Updates({ lang, updates, addUpdate, role }) {
  const t = dict[lang];
  const [text, setText] = useState('');
  return <div className="grid gap-5 xl:grid-cols-3">{role === 'admin' && <Card><div className="mb-5 flex items-center gap-3"><IconBox><Bell className="h-5 w-5" /></IconBox><h2 className="text-xl font-black">{t.writeUpdate}</h2></div><form onSubmit={(e) => { e.preventDefault(); addUpdate(text); setText(''); }} className="space-y-4"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 leading-7 outline-none focus:border-blue-500" /><button className="w-full rounded-2xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800">{t.publishUpdate}</button></form></Card>}<Card className={role === 'admin' ? 'xl:col-span-2' : 'xl:col-span-3'}><div className="mb-5 flex items-center gap-3"><IconBox><Bell className="h-5 w-5" /></IconBox><h2 className="text-xl font-black">{t.updates}</h2></div>{updates.length === 0 ? <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">{t.noUpdates}</p> : <div className="space-y-3">{[...updates].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((u) => <div key={u.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><p className="mb-2 text-xs font-black uppercase tracking-wide text-blue-700">{new Date(u.created_at).toLocaleString()}</p><p className="leading-7 text-slate-800">{u.text}</p></div>)}</div>}</Card></div>;
}

function Security({ lang, role }) {
  const t = dict[lang];
  return <div className="grid gap-5 lg:grid-cols-3"><Card><IconBox><ShieldCheck className="h-5 w-5" /></IconBox><h2 className="mt-4 text-xl font-black">{t.security}</h2><p className="mt-3 leading-7 text-slate-600">{role === 'admin' ? t.adminRights : t.studentRights}</p></Card><Card className="lg:col-span-2"><h3 className="mb-4 text-lg font-black">Supabase</h3><div className="grid gap-3 sm:grid-cols-2">{['Auth', 'Row Level Security', 'Realtime Postgres Changes', 'Storage buckets', 'Private PDF receipts', 'Admin/student roles'].map((x) => <div key={x} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">{x}</div>)}</div><p className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm font-bold leading-7 text-blue-800">{t.secureNote}</p></Card></div>;
}

export default function App() {
  const [lang, setLang] = useState('ar');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [payments, setPayments] = useState([]);
  const [files, setFiles] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [active, setActive] = useState(window.location.pathname.includes('admin') ? 'students' : 'dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const t = dict[lang];

  const currentStudent = useMemo(() => students.find((s) => s.id === selectedId) || students[0], [students, selectedId]);
  const role = profile?.role || 'student';

  const loadData = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
    let finalProfile = profileData;
    if (!finalProfile) {
      const newProfile = { id: session.user.id, email: session.user.email, full_name: session.user.email.split('@')[0], role: 'student' };
      const { data } = await supabase.from('profiles').insert(newProfile).select().single();
      finalProfile = data || newProfile;
    }
    setProfile(finalProfile);

    const { data: studentData, error: studentsError } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (studentsError) setError(studentsError.message);
    const list = studentData || [];
    setStudents(list);
    const selected = finalProfile.role === 'admin' ? (selectedId || list[0]?.id) : list[0]?.id;
    setSelectedId(selected || '');
    setLoading(false);
  }, [session?.user, selectedId]);

  const loadRelated = useCallback(async () => {
    if (!currentStudent?.id) return;
    const [p, f, u] = await Promise.all([
      supabase.from('payments').select('*').eq('student_id', currentStudent.id).order('created_at', { ascending: false }),
      supabase.from('project_files').select('*').eq('student_id', currentStudent.id).order('created_at', { ascending: false }),
      supabase.from('admin_updates').select('*').eq('student_id', currentStudent.id).order('created_at', { ascending: false }),
    ]);
    setPayments(p.data || []);
    setFiles(f.data || []);
    setUpdates(u.data || []);
  }, [currentStudent?.id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) loadData(); else setLoading(false); }, [session]);
  useEffect(() => { loadRelated(); }, [loadRelated]);

  useEffect(() => {
    if (!session) return;
    const channel = supabase
      .channel('expos-univ-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => loadRelated())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_files' }, () => loadRelated())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_updates' }, () => loadRelated())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [session, loadData, loadRelated]);

  async function login(email, password) {
    setError('');
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) setError(t.loginError);
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setStudents([]);
    setSelectedId('');
  }

  async function updateStudent(id, patch) {
    setError('');
    const { error: updateError } = await supabase.from('students').update(patch).eq('id', id);
    if (updateError) setError(t.saveError);
    await loadData();
  }

  async function addPayment({ amount, payment_date, file }) {
    if (!file || !amount || !currentStudent) return;
    setError('');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${session.user.id}/${Date.now()}-${safeName}`;
    const uploaded = await supabase.storage.from('payment-receipts').upload(path, file, { upsert: false });
    if (uploaded.error) return setError(t.saveError);
    const { error: insertError } = await supabase.from('payments').insert({ student_id: currentStudent.id, user_id: session.user.id, amount, payment_date, receipt_path: path, receipt_name: file.name });
    if (insertError) setError(t.saveError);
    await loadRelated();
  }

  async function uploadFile({ file, file_type }) {
    if (!file || !currentStudent) return;
    setError('');
    const targetUserId = currentStudent.user_id;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${targetUserId}/${Date.now()}-${safeName}`;
    const uploaded = await supabase.storage.from('project-files').upload(path, file, { upsert: false });
    if (uploaded.error) return setError(t.saveError);
    const { error: insertError } = await supabase.from('project_files').insert({ student_id: currentStudent.id, name: file.name, file_type, file_path: path });
    if (insertError) setError(t.saveError);
    await loadRelated();
  }

  async function downloadFile(file) {
    const { data, error: urlError } = await supabase.storage.from('project-files').createSignedUrl(file.file_path, 60);
    if (urlError) return setError(t.saveError);
    window.open(data.signedUrl, '_blank');
  }

  async function addUpdate(text) {
    if (!text.trim() || !currentStudent) return;
    setError('');
    const { error: insertError } = await supabase.from('admin_updates').insert({ student_id: currentStudent.id, text });
    if (insertError) return setError(t.saveError);
    await supabase.from('students').update({ last_admin_update: text }).eq('id', currentStudent.id);
    await loadRelated();
  }

  if (!session) return <Login lang={lang} setLang={setLang} onLogin={login} error={error} />;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar lang={lang} role={role} active={active} setActive={setActive} logout={logout} open={menuOpen} setOpen={setMenuOpen} />
        <div className="min-w-0 flex-1">
          <Header lang={lang} setLang={setLang} profile={profile} student={currentStudent} openMenu={() => setMenuOpen(true)} />
          <main className="space-y-5 px-4 py-6 lg:px-8">
            {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
            {loading ? <Card><p className="font-bold text-slate-600">{t.loading}</p></Card> : !currentStudent ? <Card><p className="font-bold text-slate-600">لا يوجد ملف طالب مرتبط بهذا الحساب. أضف الطالب من قاعدة البيانات.</p></Card> : <>
              {role === 'admin' && <AdminControls lang={lang} students={students} selectedId={selectedId} setSelectedId={setSelectedId} student={currentStudent} updateStudent={updateStudent} />}
              {(active === 'dashboard' || active === 'students') && <Dashboard lang={lang} student={currentStudent} />}
              {active === 'payments' && <Payments lang={lang} student={currentStudent} payments={payments} addPayment={addPayment} role={role} />}
              {active === 'files' && <Files lang={lang} student={currentStudent} files={files} uploadFile={uploadFile} downloadFile={downloadFile} role={role} />}
              {active === 'updates' && <Updates lang={lang} updates={updates} addUpdate={addUpdate} role={role} />}
              {active === 'security' && <Security lang={lang} role={role} />}
            </>}
          </main>
        </div>
      </div>
    </div>
  );
}
