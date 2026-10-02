"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  Sparkles,
  ArrowRight,
  Layers,
  GraduationCap,
  UserPlus,
  CheckCircle2,
  Code
} from "lucide-react";

const STORAGE_KEY = "projecthub_capstone_data_v2";
const USER_STORAGE_KEY = "projecthub_active_user_v2";

export default function JoinProjectPage() {
  const params = useParams();
  const router = useRouter();
  const inviteCode = (params?.code as string) || "hub_wy-y-ebtzRI";

  const [name, setName] = useState("");
  const [role, setRole] = useState("Frontend Lead & UI/UX Design");
  const [email, setEmail] = useState("");
  const [roll, setRoll] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rollNo = roll.trim() || `CS2023-0${Math.floor(Math.random() * 80 + 20)}`;
    const userEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@projecthub.edu`;

    if (typeof window !== "undefined") {
      let currentProject: any = null;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          currentProject = JSON.parse(saved);
        }
      } catch (err) {
        console.error(err);
      }

      const newMember = {
        name: name.trim(),
        role: role,
        roll: rollNo,
        email: userEmail
      };

      const newActivity = {
        id: Date.now(),
        title: `${name.trim()} joined team as ${role}`,
        desc: "Joined via shareable project invitation link",
        time: "Just now",
        type: "join"
      };

      let updatedMembers = [newMember];
      let updatedActivities = [newActivity];

      if (currentProject) {
        const existingMembers = currentProject.members || [];
        const isAlreadyMember = existingMembers.some((m: any) => m.name.toLowerCase() === name.trim().toLowerCase());
        updatedMembers = isAlreadyMember ? existingMembers : [...existingMembers, newMember];
        updatedActivities = [newActivity, ...(currentProject.activities || [])];
        
        currentProject = {
          ...currentProject,
          members: updatedMembers,
          activities: updatedActivities
        };
      }

      if (currentProject) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProject));
      }

      // Save logged in user as this new teammate
      const newUser = {
        name: name.trim(),
        role: "student",
        roleLabel: role,
        email: userEmail,
        roll: rollNo,
        dept: "Computer Science & Engineering"
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

      // Broadcast to other tabs
      try {
        const channel = new BroadcastChannel("projecthub_collab_channel");
        channel.postMessage({ type: "MEMBER_JOINED", project: currentProject, user: newUser });
      } catch (e) {}
    }

    setJoined(true);
  };

  const handleEnterWorkspace = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f7faf9] flex flex-col font-sans-modern antialiased text-slate-800">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#008766] flex items-center justify-center text-white font-bold text-base shadow-sm">
              P
            </div>
            <span className="text-lg font-black tracking-tight text-[#0f2427]">
              Project<span className="text-[#008766]">Hub</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-[#008766] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        {joined ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center max-w-lg mx-auto animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#008766] flex items-center justify-center mx-auto mb-5 text-3xl shadow-sm">
              🎉
            </div>
            <span className="text-[11px] font-extrabold text-[#008766] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Team Member Verified
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f2427] mt-3 mb-2">
              Welcome to the Team, {name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              You are now an active collaborator on <strong>DevSphere: AI Cloud IDE</strong> as{" "}
              <strong className="text-[#008766]">{role}</strong>. You can now edit code, submit pull requests, and track capstone milestones.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Roll Number:</span>
                <strong className="font-mono text-slate-800">{roll || "CS2023-019"}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Assigned Role:</span>
                <strong className="text-[#008766]">{role}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Supervisor:</span>
                <strong className="text-slate-800">Prof. Arvind Verma</strong>
              </div>
            </div>

            <button
              onClick={handleEnterWorkspace}
              className="w-full py-3.5 bg-gradient-to-r from-[#008766] to-[#0f9d75] hover:from-[#007054] hover:to-[#0c8261] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🚀 Open Collaborative Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Column: Project Overview */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#0f2427] via-[#143236] to-[#0a181a] p-8 text-white flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider mb-4 border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Capstone Team Invite</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-3">
                  DevSphere: AI-Powered Autonomous Cloud IDE
                </h1>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  A centralized developer workspace integrating containerized sandboxes, continuous AST static analysis, and real-time team pair programming.
                </p>

                <div className="space-y-3 text-xs pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Leader: <strong>Aarav Sharma</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Supervisor: <strong>Prof. Arvind Verma</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Domain: <strong>Web SaaS & Cloud</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-400 font-mono">
                Invite Code: <span className="text-emerald-400">{inviteCode}</span>
              </div>
            </div>

            {/* Right Column: Instant Join Form */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
              <div className="mb-6">
                <span className="text-[10px] font-extrabold text-[#008766] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  No Prior Account Required • Instant Join
                </span>
                <h2 className="text-2xl font-black text-[#0f2427] tracking-tight mt-2 mb-1">
                  Join Project Team
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your university details and choose your specialization to start collaborating.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Kunal Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department Roll No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., CS2023-019"
                      value={roll}
                      onChange={(e) => setRoll(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institutional Email
                    </label>
                    <input
                      type="email"
                      placeholder="e.g., kunal@projecthub.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Your Role in this Capstone
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008766]"
                  >
                    <option value="Frontend Lead & UI/UX Design">Frontend Lead & UI/UX Design</option>
                    <option value="Backend Architect & APIs">Backend Architect & APIs</option>
                    <option value="AI / ML Specialist & Data Pipeline">AI / ML Specialist & Data Pipeline</option>
                    <option value="DevOps & Docker Infrastructure">DevOps & Docker Infrastructure</option>
                    <option value="QA Lead & AST Security Auditor">QA Lead & AST Security Auditor</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#008766] hover:bg-[#007054] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Join Capstone Team Now</span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-400">
                  By joining, you will be allocated 1 contributor slot in this capstone group.
                </p>
              </form>
            </div>

          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        ProjectHub © 2026 • University Capstone Operating System
      </footer>
    </div>
  );
}
