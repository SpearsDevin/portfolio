/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GithubProfile, GithubRepo, ThemeType } from './types';
import { fallbackProfile, fallbackRepos } from './data';
import Header from './components/Header';
import ProjectGrid from './components/ProjectGrid';
import Terminal from './components/Terminal';
import ResumeBuilder from './components/ResumeBuilder';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Terminal as CliIcon, Heart, Code2, Globe, HeartHandshake, Laptop, FileCode2 } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<ThemeType>('slate');
  const [profile, setProfile] = useState<GithubProfile>(fallbackProfile);
  const [repos, setRepos] = useState<GithubRepo[]>(fallbackRepos);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch true live metadata of SpearsDevin from GitHub API on load
  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setIsLoading(true);
        
        // Fetch User profile card
        const profileRes = await fetch('https://api.github.com/users/SpearsDevin');
        if (!profileRes.ok) {
          throw new Error(`Profile query failed with status: ${profileRes.status}`);
        }
        const profileData = await profileRes.json();

        // Fetch User repos
        const reposRes = await fetch('https://api.github.com/users/SpearsDevin/repos?per_page=100&sort=updated');
        if (!reposRes.ok) {
          throw new Error(`Repos query failed with status: ${reposRes.status}`);
        }
        const reposData = await reposRes.json();

        if (profileData && profileData.login) {
          setProfile(profileData);
        }
        if (Array.isArray(reposData) && reposData.length > 0) {
          // Exclude forks or customize sorting
          const cleanRepos = reposData.filter((r: any) => !r.fork);
          setRepos(cleanRepos.length > 0 ? cleanRepos : reposData);
        }
        
        setIsUsingFallback(false);
      } catch (err) {
        console.warn("GitHub REST Fetch limited/faulted. Loading extreme fidelity asset backups. Trace:", err);
        setProfile(fallbackProfile);
        setRepos(fallbackRepos);
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  return (
    <div
      className={`min-h-screen w-full transition-all duration-500 overflow-x-hidden relative flex flex-col justify-between py-10 px-4 md:px-8 lg:px-12
        ${theme === 'slate' ? 'bg-[#0b0f19] text-slate-100 font-sans' : ''}
        ${theme === 'cyberpunk' ? 'bg-[#040108] text-[#ff0088] font-sans theme-cyberpunk' : ''}
        ${theme === 'matrix' ? 'bg-black text-[#00ff66] font-mono theme-matrix' : ''}
        ${theme === 'sunset' ? 'bg-gradient-to-b from-[#0e0a1f] via-[#1a0f30] to-[#04020a] text-amber-50 font-sans theme-sunset' : ''}
      `}
    >
      
      {/* SCANLINE OVERLAY FOR TERMINAL FLUIDITY */}
      {theme === 'matrix' && (
        <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-50 opacity-40" />
      )}
      {theme === 'cyberpunk' && (
        <div className="fixed inset-0 bg-[#ff0055]/[0.015] pointer-events-none z-50 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
      )}

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-10">
        
        {/* API LIMITATION WARN DECK -> rendered with elegant technical style */}
        <AnimatePresence>
          {isUsingFallback && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full"
            >
              <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-4 font-mono
                ${theme === 'slate' ? 'bg-slate-900/60 border-slate-700/65 text-slate-300' : ''}
                ${theme === 'cyberpunk' ? 'bg-[#ff0055]/5 border-[#ff0055]/20 text-pink-400' : ''}
                ${theme === 'matrix' ? 'bg-black border-[#00ff66]/20 text-[#00ff66]' : ''}
                ${theme === 'sunset' ? 'bg-amber-950/40 border-amber-500/10 text-amber-400' : ''}
              `}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 animate-bounce" />
                  <span>
                    <strong className="uppercase">Notice:</strong> Standard GitHub API Rate Limiter reached. Smoothly operating under unified offline-first cached telemetry.
                  </span>
                </div>
                <span className="hidden lg:inline text-[10px] opacity-50">API SAFE-MODE ACTIVE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 1: Personal profile card & status dashboard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header
            profile={profile}
            activeTheme={theme}
            setTheme={setTheme}
            isLoading={isLoading}
          />
        </motion.div>

        {/* SECTION 2: Dynamic Terminal / Interactive CV Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main timeline panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-12 xl:col-span-7 w-full h-full"
          >
            <ResumeBuilder
              activeTheme={theme}
              primaryLanguage={repos[0]?.language || 'JavaScript'}
            />
          </motion.div>

          {/* Interactive console terminal to trigger features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-12 xl:col-span-5 w-full h-full"
          >
            <Terminal
              activeTheme={theme}
              setTheme={setTheme}
              publicRepoCount={profile.public_repos}
            />
          </motion.div>
          
        </div>

        {/* SECTION 3: Dynamic Live Repository visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full"
        >
          <ProjectGrid
            repos={repos}
            activeTheme={theme}
          />
        </motion.div>

      </div>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto w-full mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono opacity-55 text-center sm:text-left select-none">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          <span>SpearsDevin Portfolio • Crafted for extreme visual index</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/SpearsDevin" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            Official Github
          </a>
          <span>•</span>
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <span>Responsive SPA compiled static</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
