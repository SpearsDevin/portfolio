/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Github, MapPin, Calendar, Heart, Terminal, Shield, Award, Sparkles, Sun, Moon } from 'lucide-react';
import { GithubProfile, ThemeType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  profile: GithubProfile;
  activeTheme: ThemeType;
  setTheme: (t: ThemeType) => void;
  isLoading: boolean;
}

export default function Header({ profile, activeTheme, setTheme, isLoading }: HeaderProps) {
  const [tickerTime, setTickerTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTickerTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const themes: { id: ThemeType; name: string; icon: React.ReactNode; color: string }[] = [
    { id: 'slate', name: 'Slate Space', icon: <Moon className="w-4 h-4" />, color: 'bg-slate-800 text-slate-100 border-slate-700' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: <Sparkles className="w-4 h-4" />, color: 'bg-[#1e0b36] text-[#ff0055] border-[#ff0055]/30' },
    { id: 'matrix', name: 'Matrix Terminal', icon: <Terminal className="w-4 h-4" />, color: 'bg-black text-[#00ff66] border-[#00ff66]/30' },
    { id: 'sunset', name: 'Sunset Amber', icon: <Sun className="w-4 h-4" />, color: 'bg-amber-950 text-amber-200 border-amber-800/30' },
  ];

  return (
    <header className="relative w-full z-10 transition-all duration-300">
      {/* Background visual styling depends on the selected theme */}
      <div className={`p-6 md:p-8 rounded-3xl border shadow-xl backdrop-blur-md overflow-hidden relative
        ${activeTheme === 'slate' ? 'bg-slate-900/40 border-slate-800/80 shadow-slate-950/20 text-slate-100' : ''}
        ${activeTheme === 'cyberpunk' ? 'bg-[#0f041c]/50 border-[#ff0055]/20 shadow-pink-500/5 text-pink-100' : ''}
        ${activeTheme === 'matrix' ? 'bg-black/80 border-[#00ff66]/20 shadow-green-500/5 text-green-100 font-mono' : ''}
        ${activeTheme === 'sunset' ? 'bg-gradient-to-br from-amber-950/30 to-indigo-950/30 border-amber-500/10 shadow-amber-500/5 text-amber-50' : ''}
      `}>
        {/* Animated grid decorative background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />

        {/* Outer glowing nodes */}
        {activeTheme === 'cyberpunk' && (
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-tr from-pink-500 to-violet-600 rounded-full blur-[80px] opacity-15 pointer-events-none" />
        )}
        {activeTheme === 'sunset' && (
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-tr from-amber-500 to-indigo-500 rounded-full blur-[80px] opacity-15 pointer-events-none" />
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Left Block: Avatar and Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
            <div className="relative group">
              {/* Outer orbit rings */}
              <div className={`absolute -inset-1 rounded-2xl blur opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse-slow
                ${activeTheme === 'slate' ? 'bg-slate-500' : ''}
                ${activeTheme === 'cyberpunk' ? 'bg-gradient-to-r from-pink-500 to-purple-600' : ''}
                ${activeTheme === 'matrix' ? 'bg-green-500' : ''}
                ${activeTheme === 'sunset' ? 'bg-gradient-to-r from-amber-400 to-orange-600' : ''}
              `} />
              
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                alt={profile.name}
                id="avatar-image"
                referrerPolicy="no-referrer"
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl relative z-10 border object-cover shadow-md transition-transform duration-300 group-hover:scale-[1.03]
                  ${activeTheme === 'slate' ? 'border-slate-700/80' : ''}
                  ${activeTheme === 'cyberpunk' ? 'border-[#ff0055]/40' : ''}
                  ${activeTheme === 'matrix' ? 'border-[#00ff66]/40' : ''}
                  ${activeTheme === 'sunset' ? 'border-amber-500/20' : ''}
                `}
              />

              <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider shadow z-10 animate-bounce
                ${activeTheme === 'slate' ? 'bg-slate-800 text-slate-300 border border-slate-700' : ''}
                ${activeTheme === 'cyberpunk' ? 'bg-[#ff0055] text-white border border-[#ff0077]' : ''}
                ${activeTheme === 'matrix' ? 'bg-black text-[#00ff66] border border-[#00ff66]' : ''}
                ${activeTheme === 'sunset' ? 'bg-amber-500 text-amber-950 font-sans border border-amber-300' : ''}
              `}>
                Active
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight font-display`}>
                  {profile.name}
                </h1>
                
                <span className={`text-[11px] font-medium tracking-wide font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full uppercase
                  ${activeTheme === 'slate' ? 'bg-slate-800/80 text-emerald-400 border border-emerald-400/20' : ''}
                  ${activeTheme === 'cyberpunk' ? 'bg-pink-950/40 text-pink-400 border border-pink-500/20' : ''}
                  ${activeTheme === 'matrix' ? 'bg-black text-green-400 border border-[#00ff66]/50' : ''}
                  ${activeTheme === 'sunset' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/20' : ''}
                `}>
                  <Award className="w-3 h-3 text-current" />
                  Hirable Dev
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1 bg-transparent text-sm opacity-80 select-none">
                <span className="font-mono text-xs">@{profile.login}</span>
                <span className="mx-1">•</span>
                <span className="font-mono text-xs">Software // Web Dev</span>
              </div>

              <p className={`text-sm tracking-wide max-w-sm sm:max-w-md line-clamp-2
                ${activeTheme === 'matrix' ? 'text-green-300/80' : 'text-slate-300/85'}
              `}>
                "{profile.bio}"
              </p>

              {/* Sub-telemetries */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-y-1 gap-x-4 text-xs font-mono opacity-70 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>{profile.location || 'USA'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span>Bio: 22y/o </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ticking: {tickerTime || '12:00:00 PM'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Stats and Theme Controller */}
          <div className="flex flex-col items-center md:items-end gap-5">
            {/* Live profile indicators */}
            <div className="flex items-center gap-8 text-center bg-black/10 py-3 px-5 sm:px-6 rounded-2xl border border-white/5 shadow-inner">
              <div>
                <div className={`text-lg sm:text-xl font-bold font-display
                  ${activeTheme === 'slate' ? 'text-slate-100' : ''}
                  ${activeTheme === 'cyberpunk' ? 'text-[#ff0055]' : ''}
                  ${activeTheme === 'matrix' ? 'text-[#00ff66]' : ''}
                  ${activeTheme === 'sunset' ? 'text-amber-400' : ''}
                `}>
                  {profile.public_repos}
                </div>
                <div className="text-[10px] uppercase tracking-wider opacity-60 font-mono mt-0.5">Repos</div>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div>
                <div className={`text-lg sm:text-xl font-bold font-display
                  ${activeTheme === 'slate' ? 'text-slate-100' : ''}
                  ${activeTheme === 'cyberpunk' ? 'text-[#00ffff]' : ''}
                  ${activeTheme === 'matrix' ? 'text-[#00ff66]' : ''}
                  ${activeTheme === 'sunset' ? 'text-orange-400' : ''}
                `}>
                  {profile.followers}
                </div>
                <div className="text-[10px] uppercase tracking-wider opacity-60 font-mono mt-0.5">Followers</div>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div>
                <div className={`text-lg sm:text-xl font-bold font-display
                  ${activeTheme === 'slate' ? 'text-slate-100' : ''}
                  ${activeTheme === 'cyberpunk' ? 'text-purple-400' : ''}
                  ${activeTheme === 'matrix' ? 'text-[#00ff66]' : ''}
                  ${activeTheme === 'sunset' ? 'text-indigo-300' : ''}
                `}>
                  {profile.following}
                </div>
                <div className="text-[10px] uppercase tracking-wider opacity-60 font-mono mt-0.5">Following</div>
              </div>
            </div>

            {/* Core theme selector pills */}
            <div className="flex flex-col items-center sm:items-end gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider opacity-50 select-none">
                Select Theme Protocol
              </span>
              <div className="flex flex-wrap items-center gap-1.5 bg-black/20 p-1.5 rounded-full border border-white/5">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    id={`theme-btn-${theme.id}`}
                    onClick={() => setTheme(theme.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-full transition-all duration-200 cursor-pointer select-none
                      ${activeTheme === theme.id 
                        ? `${theme.color} ring-1 ring-white/10 scale-102 font-semibold shadow-md` 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {theme.icon}
                    <span className="hidden sm:inline">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
