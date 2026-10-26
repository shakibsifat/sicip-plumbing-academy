"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const questions = [
  { id: 1, chapter: "Pipe Fittings", bn: "পাইপের দিক পরিবর্তন করতে সাধারণত কোন ফিটিং ব্যবহার করা হয়?", en: "Which fitting is commonly used to change the direction of a pipe?", image: "↪️", options: ["Tee", "Elbow", "Reducer", "Socket"], answer: 1, explain: "Elbow পাইপের দিক পরিবর্তনে ব্যবহৃত হয়।" },
  { id: 2, chapter: "Plumbing Tools", bn: "পাইপ ধরতে ও ঘোরাতে কোন টুলটি বেশি ব্যবহৃত হয়?", en: "Which tool is commonly used to grip and turn a pipe?", image: "🔧", options: ["Pipe wrench", "Measuring tape", "Hacksaw", "Spirit level"], answer: 0, explain: "Pipe wrench পাইপ শক্তভাবে ধরে ঘোরাতে ব্যবহৃত হয়।" },
  { id: 3, chapter: "Pipe Fittings", bn: "একটি লাইনে শাখা সংযোগ দিতে কোন fitting ব্যবহার করা হয়?", en: "Which fitting is used to create a branch in a pipe line?", image: "⑂", options: ["Cap", "Plug", "Tee", "Union"], answer: 2, explain: "Tee fitting মূল লাইনের সঙ্গে শাখা তৈরি করে।" }
];

const chapters = ["Introduction to Plumbing","Plumbing Tools & Equipment","Pipe Materials and Types","Pipe Fittings and Accessories","Pipe Measurement and Calculation","Pipe Cutting and Threading","Pipe Jointing Methods","Valves and Their Uses","Water Supply System","Drainage System","Sanitary Installation","Plumbing Drawing and Symbols","Safety Rules and PPE","Practical Workshop","Final Examination Preparation"];

export default function Home() {
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState("bn");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const score = useMemo(() => questions.filter(q => answers[q.id] === q.answer).length, [answers]);
  const loggedIn = false;

  async function login() {
    if (!supabase) { setNotice("Supabase সংযোগ এখনো সেট করা হয়নি। .env.local ফাইলে Project URL ও Key যোগ করুন।"); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setNotice(error ? error.message : "Login সফল হয়েছে। পেজটি Refresh করুন।");
  }
  async function register() {
    if (!supabase) { setNotice("Supabase সংযোগ এখনো সেট করা হয়নি। .env.local ফাইলে Project URL ও Key যোগ করুন।"); return; }
    const { error } = await supabase.auth.signUp({ email, password });
    setNotice(error ? error.message : "Registration request পাঠানো হয়েছে। Email যাচাই করুন।");
  }

  const nav = [{id:"home",bn:"হোম",en:"Home"},{id:"course",bn:"কোর্স",en:"Course"},{id:"exam",bn:"পরীক্ষা",en:"Exam"},{id:"materials",bn:"PDF লাইব্রেরি",en:"PDF Library"},{id:"admin",bn:"অ্যাডমিন",en:"Admin"}];
  return <main className="shell">
    <header className="topbar"><div className="brand"><div className="brandmark">P</div><div><b>SICIP PLUMBING ACADEMY</b><small>Digital Learning & Examination</small></div></div><div className="top-actions"><button className="lang" onClick={()=>setLang(lang==="bn"?"en":"bn")}>{lang==="bn"?"বাংলা":"English"}</button><button className="login" onClick={()=>setShowLogin(true)}>Login / Sign up</button></div></header>
    <section className="hero"><div><span className="eyebrow">SICIP • SKILLS TRAINING</span><h1>{lang==="bn"?"শিখুন, অনুশীলন করুন, দক্ষ হয়ে উঠুন":"Learn. Practice. Build Skills."}</h1><p>{lang==="bn"?"Plumbing & Pipe Fittings কোর্সের সব নোট, ছবি, PDF ও পরীক্ষা এক জায়গায়।":"Your Plumbing & Pipe Fittings notes, diagrams, PDFs and exams in one place."}</p><div className="hero-actions"><button onClick={()=>setTab("course")} className="primary">কোর্স দেখুন / Explore course</button><button onClick={()=>setShowLogin(true)} className="outline">শিক্ষার্থী Login</button></div></div><div className="hero-art"><div className="pipe pipe-a"></div><div className="pipe pipe-b"></div><div className="pipe pipe-c"></div><div className="art-label">PLUMBING<br/> & FITTINGS</div></div></section>
    <nav className="nav">{nav.map(n=><button key={n.id} className={tab===n.id?"active":""} onClick={()=>setTab(n.id)}>{lang==="bn"?n.bn:n.en}</button>)}</nav>
    {tab==="home" && <><section className="stats"><div><b>15</b><span>কোর্স অধ্যায়</span></div><div><b>06</b><span>প্রশ্নের ধরন</span></div><div><b>24/7</b><span>অনুশীলনের সুযোগ</span></div><div><b>বাংলা + EN</b><span>দুই ভাষায় শেখা</span></div></section><section className="section"><div className="section-head"><div><span className="eyebrow">LEARNING AREA</span><h2>শেখা শুরু করুন</h2></div><button className="text-btn" onClick={()=>setTab("course")}>সব অধ্যায় দেখুন →</button></div><div className="cards"><article className="feature"><div className="feature-icon">📘</div><h3>Study Materials</h3><p>ক্লাস নোট, PDF বই ও গুরুত্বপূর্ণ তথ্য।</p><button onClick={()=>setTab("materials")}>PDF Library খুলুন</button></article><article className="feature"><div className="feature-icon">📝</div><h3>Online Examination</h3><p>MCQ, ছবি-ভিত্তিক ও লিখিত পরীক্ষার প্রস্তুতি।</p><button onClick={()=>setTab("exam")}>পরীক্ষা দিন</button></article><article className="feature"><div className="feature-icon">🛠️</div><h3>Practical Learning</h3><p>Tools, fittings ও বাস্তব কাজের গাইড।</p><button onClick={()=>setTab("course")}>শিখতে থাকুন</button></article></div></section></>}
    {tab==="course" && <section className="section"><span className="eyebrow">COURSE CONTENT</span><h2>Plumbing & Pipe Fittings</h2><p className="muted">প্রতিটি অধ্যায়ে Notes, PDF, MCQ, Written ও Practical resources রাখা যাবে।</p><div className="chapter-list">{chapters.map((c,i)=><div className="chapter" key={c}><span className="chapter-no">{String(i+1).padStart(2,"0")}</span><div><b>{c}</b><small>Chapter {i+1} · Study notes and practice</small></div><span className="arrow">›</span></div>)}</div></section>}
    {tab==="exam" && <section className="section"><div className="section-head"><div><span className="eyebrow">PRACTICE TEST • DEMO</span><h2>MCQ Practice Exam</h2></div><span className="pill">৩টি নমুনা প্রশ্ন</span></div><div className="exam-note">এটি নমুনা পরীক্ষা। এখানে দেওয়া প্রশ্নগুলো ডেমোর জন্য। আসল পরীক্ষার প্রশ্ন Admin Panel থেকে যোগ হবে।</div>{questions.map((q,i)=><article className="question" key={q.id}><div className="q-meta"><span>প্রশ্ন {i+1}</span><span>{q.chapter}</span></div><div className="q-image">{q.image}</div><h3>{q.bn}</h3><p className="muted">{q.en}</p><div className="options">{q.options.map((o,j)=><button disabled={submitted} className={answers[q.id]===j?"chosen":""} onClick={()=>setAnswers({...answers,[q.id]:j})} key={o}><span>{String.fromCharCode(65+j)}</span>{o}</button>)}</div>{submitted && <p className={answers[q.id]===q.answer?"correct":"incorrect"}>{answers[q.id]===q.answer?"সঠিক উত্তর":"সঠিক উত্তর: "+q.options[q.answer]} · {q.explain}</p>}</article>)}<div className="exam-footer">{submitted?<><b>তোমার নম্বর: {score}/{questions.length}</b><button className="primary" onClick={()=>{setAnswers({});setSubmitted(false)}}>আবার চেষ্টা করুন</button></>:<button className="primary" onClick={()=>setSubmitted(true)}>পরীক্ষা জমা দিন</button>}</div></section>}
    {tab==="materials" && <section className="section"><span className="eyebrow">STUDY LIBRARY</span><h2>PDF & Class Notes</h2><div className="locked"><div className="lock-icon">🔒</div><h3>শুধু Login করা শিক্ষার্থীদের জন্য</h3><p>ক্লাসের PDF, ছবি ও নোট দেখতে Login করতে হবে। Admin/Teacher নতুন ফাইল আপলোড করবেন।</p><button className="primary" onClick={()=>setShowLogin(true)}>Login করুন</button></div><p className="muted small">PDF ফাইলের access server-side permission দিয়ে নিয়ন্ত্রণ করতে হবে।</p></section>}
    {tab==="admin" && <section className="section"><span className="eyebrow">CONTROL PANEL</span><h2>Admin & Teacher Access</h2><div className="admin-grid"><div><b>Super Admin</b><p>তুমি: সব সেটিংস, Admin নিয়ন্ত্রণ, প্রশ্ন, PDF, পরীক্ষা ও ফলাফল।</p></div><div><b>Teacher Admin</b><p>শিক্ষক: অধ্যায়, প্রশ্ন, PDF, পরীক্ষা ও শিক্ষার্থীদের ফলাফল পরিচালনা।</p></div></div><div className="locked"><div className="lock-icon">🛡️</div><h3>নিরাপদ Admin Login</h3><p>Admin role শুধু Database থেকে নির্ধারণ করতে হবে। Public registration দিয়ে কেউ Admin হতে পারবে না।</p><button className="primary" onClick={()=>setShowLogin(true)}>Admin Login</button></div></section>}
    <footer><b>SICIP PLUMBING ACADEMY</b><span>শেখা • অনুশীলন • দক্ষতা</span><small>শিক্ষামূলক ডেমো। এটি এখনো Supabase বা Live Hosting-এর সঙ্গে সংযুক্ত নয়।</small></footer>
    {showLogin && <div className="modal-backdrop" onClick={()=>setShowLogin(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowLogin(false)}>×</button><span className="eyebrow">STUDENT ACCESS</span><h2>Login / Registration</h2><label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="name@example.com"/></label><label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="কমপক্ষে ৬ অক্ষর"/></label><div className="modal-actions"><button className="primary" onClick={login}>Login</button><button className="outline" onClick={register}>নতুন Account</button></div>{notice && <p className="notice">{notice}</p>}<p className="muted small">ডেমোতে Account তৈরি করতে Supabase সংযোগ প্রয়োজন।</p></div></div>}
  </main>;
}
