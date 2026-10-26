# SICIP Plumbing Academy

এটি SICIP Plumbing & Pipe Fittings-এর জন্য তৈরি একটি Next.js + Supabase starter project।

## এখন কী আছে
- বাংলা/English language toggle
- Responsive Home, Course, Exam, PDF Library ও Admin sections
- ১৫টি sample course chapter
- ৩টি sample MCQ দিয়ে interactive practice
- Login/registration UI এবং Supabase Auth connection placeholder
- Supabase database schema starter

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এই ZIP একটি starter/demo build। এটি এখনো live website নয়। Supabase project, environment variables, storage policies, trusted admin roles, secure answer checking, written grading এবং deployment সম্পন্ন না করা পর্যন্ত production-এ শিক্ষার্থীদের ব্যবহার করতে দেবেন না। Demo MCQ-র উত্তর browser code-এ আছে, তাই এগুলো official exam-এ ব্যবহার করবেন না।

## Android থেকে চালানোর সহজ পথ
1. ZIP-টি Replit বা অন্য Next.js-compatible cloud coding workspace-এ upload/import করুন।
2. Supabase-এ project তৈরি করুন।
3. Supabase SQL Editor-এ `supabase/schema.sql` চালান। Production-এর আগে policies review করুন।
4. Supabase Project Settings থেকে Project URL ও Publishable/Anon Key নিন।
5. Project root-এ `.env.local` নামে ফাইল তৈরি করে লিখুন:

   NEXT_PUBLIC_SUPABASE_URL=আপনার_Project_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=আপনার_Publishable_Key

6. Terminal-এ `npm install` তারপর `npm run dev` চালান।
7. Authentication, storage policies এবং admin authorization সম্পূর্ণ করুন।
8. GitHub-এ push করে Vercel-এ deploy করুন।

## Storage
Supabase Storage-এ `course-pdfs` এবং `question-images` নামে private bucket তৈরি করুন। Authenticated access এবং teacher/admin upload policies আলাদাভাবে সেট করুন। PDF download করার সময় server থেকে স্বল্প-মেয়াদি signed URL তৈরি করুন।

## Admin নিরাপত্তা
- Public signup-এ role সবসময় `student` থাকবে।
- প্রথম Super Admin trusted server-side process/SQL দিয়ে নির্ধারণ করতে হবে।
- Teacher Admin-কে কেবল Super Admin অনুমতি দেবে।
- Client-side role check যথেষ্ট নয়। সব write action-এ RLS/server-side authorization লাগবে।
- Service role key কখনো browser code বা public repository-তে রাখবেন না।

## Suggested next development steps
1. Admin CRUD screens and server actions.
2. Secure exam submission/grading RPC or server endpoint.
3. Written answer review queue.
4. Signed PDF/image URLs.
5. Result history, bookmarks, leaderboard and notices.
6. Audit logs, backups and production RLS review.
