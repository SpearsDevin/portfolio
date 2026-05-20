/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { GithubRepo, ThemeType, CuratedProject } from '../types';
import { curatedProjects } from '../data';
import { Search, Star, GitFork, ExternalLink, SlidersHorizontal, ArrowUpDown, Shield, Maximize, Umbrella, FolderCode, GraduationCap, Cpu, Code2, FolderGit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectGridProps {
  repos: GithubRepo[];
  activeTheme: ThemeType;
}

// Icon helper mapping based on string
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Shield': return <Shield className="w-5 h-5 text-indigo-400" />;
    case 'Maximize': return <Maximize className="w-5 h-5 text-pink-400" />;
    case 'Umbrella': return <Umbrella className="w-5 h-5 text-cyan-400" />;
    case 'FolderCode': return <FolderCode className="w-5 h-5 text-emerald-400" />;
    case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-amber-400" />;
    case 'Cpu': return <Cpu className="w-5 h-5 text-rose-400" />;
    default: return <Code2 className="w-5 h-5 text-slate-400" />;
  }
};

export default function ProjectGrid({ repos, activeTheme }: ProjectGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState<'stars' | 'recent' | 'size' | 'name'>('stars');
  const [showCuratedOnly, setShowCuratedOnly] = useState(false);

  // Extract unique languages used across public repositories dynamically
  const languages = useMemo(() => {
    const list = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) {
        list.add(repo.language);
      }
    });
    return ['All', ...Array.from(list)];
  }, [repos]);

  // Combine live repository details with custom local curated content!
  const combinedCurated = useMemo(() => {
    return Object.keys(curatedProjects).map((key) => {
      const spec = curatedProjects[key];
      const liveRepo = repos.find((r) => r.name.toLowerCase() === key.toLowerCase());
      return {
        spec,
        liveRepo: liveRepo || {
          id: Math.random(),
          name: key,
          full_name: `SpearsDevin/${key}`,
          html_url: `https://github.com/SpearsDevin/${key}`,
          description: "Curated developer suite currently tracking live profile statistics.",
          language: spec.tags[0] || "JavaScript",
          stargazers_count: 5,
          forks_count: 2,
          created_at: "",
          updated_at: "",
          size: 1540
        } as GithubRepo
      };
    });
  }, [repos]);

  // Full repository listings filtered and sorted
  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // Search term filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (repo) =>
          repo.name.toLowerCase().includes(term) ||
          (repo.description && repo.description.toLowerCase().includes(term)) ||
          (repo.language && repo.language.toLowerCase().includes(term))
      );
    }

    // Language filter
    if (selectedLanguage !== 'All') {
      result = result.filter((repo) => repo.language === selectedLanguage);
    }

    // Sorting protocol
    result.sort((a, b) => {
      if (sortBy === 'stars') {
        return b.stargazers_count - a.stargazers_count;
      }
      if (sortBy === 'recent') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      if (sortBy === 'size') {
        return b.size - a.size;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [repos, searchTerm, selectedLanguage, sortBy]);

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* SECTION 1: Curated Showcase Block */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight flex items-center gap-2">
              <FolderGit2 className={`w-5 h-5 ${activeTheme === 'cyberpunk' ? 'text-pink-500' : activeTheme === 'matrix' ? 'text-green-500' : 'text-blue-400'}`} />
              Curated Masterpieces
            </h2>
          </div>
          <span className="text-xs opacity-60 font-mono hidden md:inline">
            // Highly specialized highlights
          </span>
        </div>

        {/* 3D Bento-inspired layout for special projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedCurated.map(({ spec, liveRepo }, idx) => (
            <motion.div
              key={liveRepo.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                ${activeTheme === 'slate' ? 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/40' : ''}
                ${activeTheme === 'cyberpunk' ? 'bg-[#120624]/40 border-[#ff0055]/10 hover:border-[#ff0055]/3d hover:bg-[#120624]/60' : ''}
                ${activeTheme === 'matrix' ? 'bg-black border-[#00ff66]/15 hover:border-[#00ff66]/40 hover:bg-green-950/5 font-mono' : ''}
                ${activeTheme === 'sunset' ? 'bg-gradient-to-br from-amber-950/15 to-indigo-950/15 border-amber-500/10 hover:border-amber-500/30 hover:bg-gradient-to-br hover:from-amber-950/20 hover:to-indigo-950/20' : ''}
              `}
            >
              {/* Highlight background flash */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-white/2 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div>
                {/* Visual Header of Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl border
                    ${activeTheme === 'slate' ? 'bg-slate-800/60 border-slate-700/80' : ''}
                    ${activeTheme === 'cyberpunk' ? 'bg-pink-950/30 border-[#ff0055]/20' : ''}
                    ${activeTheme === 'matrix' ? 'bg-black border-[#00ff66]/30' : ''}
                    ${activeTheme === 'sunset' ? 'bg-amber-950/60 border-amber-500/20' : ''}
                  `}>
                    {getIcon(spec.iconName || 'Code')}
                  </div>
                  
                  <span className={`text-[9px] font-bold py-0.5 px-2 rounded font-mono uppercase tracking-widest
                    ${activeTheme === 'slate' ? 'bg-slate-800 text-slate-300' : ''}
                    ${activeTheme === 'cyberpunk' ? 'bg-[#ff0055]/20 text-[#ff0055]' : ''}
                    ${activeTheme === 'matrix' ? 'bg-green-950 text-[#00ff66]' : ''}
                    ${activeTheme === 'sunset' ? 'bg-amber-500/10 text-amber-400' : ''}
                  `}>
                    {spec.difficulty || 'Expert'}
                  </span>
                </div>

                {/* Info and Custom Narrative */}
                <h3 className="text-base font-semibold font-display tracking-tight flex items-center gap-1.5 group-hover:text-amber-400 transition-colors">
                  {spec.name}
                </h3>
                
                <p className={`text-xs mt-2 mb-4 leading-relaxed line-clamp-3
                  ${activeTheme === 'matrix' ? 'text-green-300/70' : 'text-slate-300/80'}
                `}>
                  {spec.longDescription}
                </p>

                {/* Dynamic Metrics */}
                <div className={`p-3 rounded-lg flex items-center justify-between text-[11px] mb-4 font-mono 
                  ${activeTheme === 'slate' ? 'bg-slate-800/20 text-slate-400' : ''}
                  ${activeTheme === 'cyberpunk' ? 'bg-[#ff0055]/5 text-pink-400/80' : ''}
                  ${activeTheme === 'matrix' ? 'bg-green-950/20 text-green-400/80 border border-green-950' : ''}
                  ${activeTheme === 'sunset' ? 'bg-amber-500/5 text-amber-300/80' : ''}
                `}>
                  <span>Impact: {spec.impact || 'Active usage'}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{liveRepo.stargazers_count}</span>
                    <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3" />{liveRepo.forks_count}</span>
                  </div>
                </div>
              </div>

              {/* Bottom tag deck and action button */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <div className="flex flex-wrap gap-1 max-w-[70%]">
                  {spec.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[9px] font-mono opacity-60">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <a
                  href={liveRepo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  id={`curated-link-${liveRepo.name}`}
                  className={`text-[11px] font-mono inline-flex items-center gap-1.5 hover:underline transition-all
                    ${activeTheme === 'cyberpunk' ? 'text-[#ff0055]' : activeTheme === 'matrix' ? 'text-[#00ff66]' : 'text-blue-400'}
                  `}
                >
                  Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Dynamic Repository Center */}
      <div className="flex flex-col gap-6 mt-4">
        
        {/* Sorting, Searching and Filter Controls */}
        <div className={`p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all
          ${activeTheme === 'slate' ? 'bg-slate-900/10 border-slate-800/80' : ''}
          ${activeTheme === 'cyberpunk' ? 'bg-black/20 border-[#ff0055]/10' : ''}
          ${activeTheme === 'matrix' ? 'bg-black border-[#00ff66]/10' : ''}
          ${activeTheme === 'sunset' ? 'bg-amber-950/10 border-amber-500/5' : ''}
        `}>
          
          {/* Search bar inside container */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              id="repo-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search repositories (e.g. ClashBot, Python, Gauge...)"
              className={`w-full py-2 pl-10 pr-4 text-sm rounded-xl focus:outline-none focus:ring-1 transition-all
                ${activeTheme === 'slate' ? 'bg-slate-950/80 border-slate-800 text-slate-100 focus:ring-slate-500 focus:border-slate-700' : ''}
                ${activeTheme === 'cyberpunk' ? 'bg-[#180a2b] border-[#ff0055]/30 text-white focus:ring-[#ff0055] focus:border-[#ff0055]' : ''}
                ${activeTheme === 'matrix' ? 'bg-black border-[#00ff66]/30 text-[#00ff66] font-mono focus:ring-[#00ff66] focus:border-[#00ff66]' : ''}
                ${activeTheme === 'sunset' ? 'bg-amber-950/40 border-amber-800/20 text-amber-50 focus:ring-amber-500 focus:border-amber-700' : ''}
              `}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            
            {/* Horizontal Filter controller */}
            <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl border border-white/5">
              <span className="p-1 px-1.5 text-xs text-slate-500"><SlidersHorizontal className="w-3.5 h-3.5" /></span>
              {languages.slice(0, 5).map((ln) => (
                <button
                  key={ln}
                  id={`lang-filter-btn-${ln}`}
                  onClick={() => setSelectedLanguage(ln)}
                  className={`px-3 py-1 text-xs rounded-lg transition-all select-none cursor-pointer
                    ${selectedLanguage === ln
                      ? `${activeTheme === 'cyberpunk' ? 'bg-[#ff0055] text-white' : activeTheme === 'matrix' ? 'bg-green-950 text-[#00ff66] border border-[#00ff66]/30' : 'bg-slate-800 text-white'}`
                      : 'text-slate-400 hover:text-slate-200'
                    }
                  `}
                >
                  {ln}
                </button>
              ))}
            </div>

            {/* Sorting trigger option select */}
            <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-xl border border-white/5 text-xs font-mono text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="repo-sort-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="stars" className="bg-slate-900 text-slate-200">Stars (High)</option>
                <option value="recent" className="bg-slate-900 text-slate-200">Recent Updates</option>
                <option value="size" className="bg-slate-900 text-slate-200">Storage Size</option>
                <option value="name" className="bg-slate-900 text-slate-200">Name (A-Z)</option>
              </select>
            </div>

          </div>

        </div>

        {/* Dynamic results header tracker */}
        <div className="flex items-center justify-between text-xs font-mono opacity-60">
          <span>Displaying {filteredRepos.length} public records for SpearsDevin</span>
          {searchTerm || selectedLanguage !== 'All' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLanguage('All');
              }}
              className="underline hover:text-white"
            >
              Reset filters
            </button>
          ) : null}
        </div>

        {/* Active repositories list deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRepos.map((repo) => (
              <motion.div
                key={repo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-5 rounded-xl border flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200 group
                  ${activeTheme === 'slate' ? 'bg-slate-900/10 border-slate-800 hover:border-slate-700 hover:bg-slate-900/20' : ''}
                  ${activeTheme === 'cyberpunk' ? 'bg-[#150a2b]/30 border-white/5 hover:border-[#ff0055]/30' : ''}
                  ${activeTheme === 'matrix' ? 'bg-black border-[#00ff66]/10 hover:border-[#00ff66]/30 font-mono text-green-200' : ''}
                  ${activeTheme === 'sunset' ? 'bg-amber-950/5 border-amber-500/5 hover:border-amber-500/20 hover:bg-amber-950/10' : ''}
                `}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold truncate group-hover:text-blue-400 transition-colors">
                      {repo.name}
                    </h4>
                    <span className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded
                      ${repo.language === 'JavaScript' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                      ${repo.language === 'Python' ? 'bg-blue-500/10 text-blue-400' : ''}
                      ${repo.language === 'Java' ? 'bg-red-500/10 text-red-500' : ''}
                      ${!repo.language ? 'bg-slate-500/10 text-slate-400' : 'bg-slate-500/10 text-slate-300'}
                    `}>
                      {repo.language || 'Documentation'}
                    </span>
                  </div>

                  <p className={`text-xs line-clamp-2 mt-1 mb-4 h-8 opacity-75
                    ${activeTheme === 'matrix' ? 'text-green-300/60' : 'text-slate-300/70'}
                  `}>
                    {repo.description || "No public description provided for this software module."}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs opacity-60 font-mono pt-3 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      {repo.forks_count}
                    </span>
                    <span>{Math.round(repo.size / 1024) || 1} MB</span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    id={`git-link-${repo.name}`}
                    className="p-1 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty display card for search faults */}
          {filteredRepos.length === 0 && (
            <div className="col-span-full py-12 text-center rounded-xl border border-white/5 opacity-60 font-mono text-sm flex flex-col items-center gap-2">
              <span>No repositories match your filter constraints.</span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLanguage('All');
                }}
                className="text-xs underline text-blue-400"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
