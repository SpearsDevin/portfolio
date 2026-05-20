/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ThemeType } from '../types';
import { skillsList, timelineExperience } from '../data';
import { Award, Briefcase, ChevronRight, Copy, Check, Rocket, HelpCircle, Terminal, HelpCircle as HelpIcon, FileSpreadsheet, LayoutList, Puzzle } from 'lucide-react';
import { motion } from 'motion/react';

interface ResumeBuilderProps {
  activeTheme: ThemeType;
  primaryLanguage: string;
}

export default function ResumeBuilder({ activeTheme, primaryLanguage }: ResumeBuilderProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'deploy'>('timeline');
  const [repoName, setRepoName] = useState('portfolio');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Custom action workflow content
  const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main # Change to master if your default branch is master

permissions:
  contents: write

jobs:
  build-and-deploy:
    concurrency: ci-\${{ github.ref }} # prevents concurrent runs
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v4

      - name: Install and Build 🔧
        run: |
          npm ci
          npm run build

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist # The folder the build script generates
          branch: gh-pages # The branch the action deploys to`;

  const configContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/${repoName}/', // CRITICAL: This base path ensures asset links resolve on GitHub Pages!
});`;

  return (
    <div className={`p-6 md:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-300
      ${activeTheme === 'slate' ? 'bg-slate-900/40 border-slate-800/80 text-slate-100' : ''}
      ${activeTheme === 'cyberpunk' ? 'bg-[#0f041c]/50 border-[#ff0055]/20 text-pink-100' : ''}
      ${activeTheme === 'matrix' ? 'bg-black border-[#00ff66]/20 text-green-100 font-mono' : ''}
      ${activeTheme === 'sunset' ? 'bg-gradient-to-br from-amber-950/20 to-indigo-950/20 border-amber-500/10 text-amber-50' : ''}
    `}>
      
      {/* Decorative glows */}
      {activeTheme === 'cyberpunk' && (
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full blur-[80px] opacity-10 pointer-events-none" />
      )}

      {/* Tabs head */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Award className={`w-5 h-5 ${activeTheme === 'cyberpunk' ? 'text-pink-500' : activeTheme === 'matrix' ? 'text-green-500' : 'text-amber-400'}`} />
          <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-1.5">
            Developer Portfolio Deck
          </h2>
        </div>
        
        <div className="flex items-center p-1 bg-black/30 rounded-full border border-white/5 text-xs">
          <button
            id="tab-btn-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-1.5 rounded-full transition-all select-none cursor-pointer flex items-center gap-1.5
              ${activeTab === 'timeline'
                ? (activeTheme === 'cyberpunk' ? 'bg-[#ff0055] text-white font-medium' : activeTheme === 'matrix' ? 'bg-green-950 text-[#00ff66] border border-[#00ff66]/40' : 'bg-slate-800 text-white font-medium')
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <LayoutList className="w-3.5 h-3.5" />
            Bio & Timeline
          </button>
          
          <button
            id="tab-btn-deploy"
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-1.5 rounded-full transition-all select-none cursor-pointer flex items-center gap-1.5
              ${activeTab === 'deploy'
                ? (activeTheme === 'cyberpunk' ? 'bg-[#ff0055] text-white font-medium' : activeTheme === 'matrix' ? 'bg-green-950 text-[#00ff66] border border-[#00ff66]/40' : 'bg-slate-800 text-white font-medium')
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <Rocket className="w-3.5 h-3.5" />
            GitHub Pages Deploy Hub
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'timeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Timeline side */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold font-mono tracking-wider opacity-60 uppercase">
              // Timeline Chronicle
            </h3>
            
            <div className="relative border-l border-white/10 pl-5 ml-2 mt-2 space-y-6">
              {timelineExperience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  {/* Decorative dot mark on line */}
                  <div className={`absolute -left-[26px] top-1.5 w-3 h-3 rounded-full border-2 transition-all group-hover:scale-110
                    ${activeTheme === 'slate' ? 'bg-slate-900 border-slate-500' : ''}
                    ${activeTheme === 'cyberpunk' ? 'bg-[#1b0a2f] border-pink-500' : ''}
                    ${activeTheme === 'matrix' ? 'bg-black border-[#00ff66]' : ''}
                    ${activeTheme === 'sunset' ? 'bg-zinc-950 border-amber-500' : ''}
                  `} />
                  
                  <div className="text-[10px] font-mono opacity-50 font-semibold mb-1">
                    {exp.period}
                  </div>
                  
                  <h4 className="text-sm font-bold font-display group-hover:text-blue-400 transition-colors">
                    {exp.title}
                  </h4>
                  
                  <div className="text-xs font-medium opacity-80 mt-0.5 mb-1.5">
                    {exp.company}
                  </div>
                  
                  <p className={`text-xs opacity-70 leading-relaxed
                    ${activeTheme === 'matrix' ? 'text-green-300/70' : 'text-slate-300/80'}
                  `}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill charts/radar bars side */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold font-mono tracking-wider opacity-60 uppercase">
              // Competency Core Values
            </h3>

            <div className="flex flex-col gap-4">
              {skillsList.map((skill, idx) => (
                <div key={idx} className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between items-center opacity-85 font-mono text-[11px]">
                    <span className="font-semibold flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 opacity-40 text-current" />
                      {skill.name}
                    </span>
                    <span className="opacity-60">{skill.level}% [ {skill.category} ]</span>
                  </div>

                  {/* Visual gauge tracker */}
                  <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000
                        ${activeTheme === 'slate' ? 'bg-slate-400' : ''}
                        ${activeTheme === 'cyberpunk' ? 'bg-gradient-to-r from-pink-500 to-violet-600' : ''}
                        ${activeTheme === 'matrix' ? 'bg-green-500' : ''}
                        ${activeTheme === 'sunset' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : ''}
                      `}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Print and Contact prompts */}
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-center flex items-center justify-between gap-4 flex-wrap">
              <span className="opacity-65 font-mono select-none">// Verified direct from local dataset.</span>
              <a
                href="mailto:devinspears2004@gmail.com"
                id="contact-mailto-link"
                className={`py-2 px-4 rounded-xl border font-semibold select-none transition-all hover:scale-101
                  ${activeTheme === 'slate' ? 'bg-slate-800 text-slate-100 border-slate-700/85 hover:bg-slate-700/60' : ''}
                  ${activeTheme === 'cyberpunk' ? 'bg-[#ff0055] text-white border-none shadow-lg shadow-pink-500/20 hover:bg-[#ff0077]' : ''}
                  ${activeTheme === 'matrix' ? 'bg-black text-[#00ff66] border-[#00ff66]/40 hover:bg-green-950/20' : ''}
                  ${activeTheme === 'sunset' ? 'bg-amber-600 text-amber-950 border-none font-sans hover:bg-amber-500' : ''}
                `}
              >
                Hire Devin Spears
              </a>
            </div>
          </div>

        </div>
      ) : (
        /* GITHUB PAGES DEPLOY HUB */
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-blue-950/20 rounded-2xl border border-blue-500/10 flex items-start gap-3.5 text-xs leading-relaxed text-slate-300">
            <Rocket className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Deployment Helper Online</strong>
              This dashboard helps you automatically launch your custom React portfolio onto <strong>GitHub Pages</strong>. Below are the precise, copy-paste setups configured directly for SpearsDevin.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Step-by-step deploy tracker */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold font-mono tracking-wider opacity-60 uppercase">
                1. Config Setup (Deployment Directory name)
              </h4>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono opacity-80" id="repo-name-label">
                  Enter your GitHub Repository name:
                </label>
                <div className="flex gap-2 text-xs">
                  <span className="p-2 bg-black/40 border border-white/5 rounded-xl font-mono opacity-50 select-none flex items-center">
                    github.com/SpearsDevin/
                  </span>
                  <input
                    type="text"
                    id="repo-name-input"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="portfolio"
                    className="flex-1 p-2 bg-black/40 border border-white/5 rounded-xl text-white font-mono focus:outline-none focus:border-slate-500"
                  />
                </div>
                <span className="text-[10px] font-mono opacity-50 block mt-1">
                  * Note: GitHub Pages hosts repositories at <code>https://SpearsDevin.github.io/{repoName}/</code>
                </span>
              </div>

              {/* Shell Commands to setup */}
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-xs font-semibold font-mono tracking-wider opacity-60 uppercase">
                  2. Local Shell Terminal Deployment
                </h4>
                <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-[11px] font-mono text-slate-300 relative group">
                  <button
                    onClick={() => handleCopy(`git init\ngit checkout -b main\ngit add .\ngit commit -m "compiled awesome site"\ngit remote add origin https://github.com/SpearsDevin/${repoName}.git\ngit push -u origin main`, 'local')}
                    id="copy-commands-btn"
                    className="absolute right-2 top-2 p-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-slate-400 hover:text-white"
                  >
                    {copiedText === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="overflow-x-auto pr-8">
                    {`# Initialize local repository
git init
git checkout -b main
git add .
git commit -m "compiled awesome site"

# Hook up your GitHub Repository origin
git remote add origin https://github.com/SpearsDevin/${repoName}.git

# Upload and deploy
git push -u origin main`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Workflow copy sector */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold font-mono tracking-wider opacity-60 uppercase flex items-center justify-between">
                <span>3. Create <code>.github/workflows/deploy.yml</code></span>
                <button
                  onClick={() => handleCopy(workflowContent, 'workflow')}
                  id="copy-workflow-btn"
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-xs flex items-center gap-1 font-mono hover:text-white"
                >
                  {copiedText === 'workflow' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'workflow' ? 'Copied Workflow' : 'Copy YAML'}
                </button>
              </h4>

              <div className="bg-black/60 p-4 rounded-xl border border-white/5 text-[10px] font-mono text-slate-300 h-64 overflow-y-auto">
                <pre>{workflowContent}</pre>
              </div>

              {/* Vite Config copy sector */}
              <h4 className="text-xs font-semibold font-mono tracking-wider opacity-60 uppercase flex items-center justify-between mt-2">
                <span>4. Verify <code>vite.config.ts</code> Relative base</span>
                <button
                  onClick={() => handleCopy(configContent, 'config')}
                  id="copy-config-btn"
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-[10px] flex items-center gap-1 font-mono hover:text-white"
                >
                  {copiedText === 'config' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'config' ? 'Copied Config' : 'Copy Config'}
                </button>
              </h4>
              <div className="bg-black/60 p-4 rounded-xl border border-white/5 text-[10px] font-mono text-slate-300">
                <pre className="overflow-x-auto">{configContent}</pre>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
