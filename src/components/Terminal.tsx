/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { TerminalLine, ThemeType } from '../types';
import { Terminal as TerminalIcon, CornerDownLeft, Circle, Play } from 'lucide-react';

interface TerminalProps {
  activeTheme: ThemeType;
  setTheme: (t: ThemeType) => void;
  publicRepoCount: number;
}

export default function Terminal({ activeTheme, setTheme, publicRepoCount }: TerminalProps) {
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      text: "Unified Developer CLI Shell v1.0.2 [Initialized]",
      type: 'info',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      text: "Type 'help' to review directory triggers.",
      type: 'success',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim();
    if (!cleanInput) return;

    // Add command to history array
    setCommandHistory((prev) => [...prev, cleanInput]);
    setHistoryIndex(-1);

    const userLine: TerminalLine = {
      text: `spearsdevin@cli:~$ ${cleanInput}`,
      type: 'input',
      timestamp: new Date().toLocaleTimeString()
    };

    setHistory((prev) => [...prev, userLine]);
    setInputValue('');

    const tokenized = cleanInput.toLowerCase().split(' ');
    const primaryCmd = tokenized[0];
    const argument = tokenized[1];

    let replyLines: TerminalLine[] = [];

    switch (primaryCmd) {
      case 'help':
        replyLines = [
          { text: "---------------------------- COMMAND REGISTRY ----------------------------", type: 'info', timestamp: '' },
          { text: "  about         - Print professional summary, background and status.", type: 'success', timestamp: '' },
          { text: "  skills        - Render visual ASCII graph of key engineering languages.", type: 'success', timestamp: '' },
          { text: "  stats         - Return public repository stats and active indicators.", type: 'success', timestamp: '' },
          { text: "  theme [name]  - Set layout theme protocol. Available: slate, cyberpunk, matrix, sunset.", type: 'success', timestamp: '' },
          { text: "  email         - Return devinspears2004@gmail.com contact links.", type: 'success', timestamp: '' },
          { text: "  socials       - Print official handles (GitHub).", type: 'success', timestamp: '' },
          { text: "  clear         - Clear the command deck.", type: 'success', timestamp: '' },
          { text: "--------------------------------------------------------------------------", type: 'info', timestamp: '' },
        ];
        break;

      case 'about':
        replyLines = [
          { text: "Identity Structure:", type: 'info', timestamp: '' },
          { text: "  Name: Devin Spears", type: 'success', timestamp: '' },
          { text: "  Age: 21", type: 'success', timestamp: '' },
          { text: "  Role: Full Stack Web Developer // Software Engineer", type: 'success', timestamp: '' },
          { text: "  Location: Missouri, USA", type: 'success', timestamp: '' },
          { text: "  Mission: Building resilient micro-services, Discord ecosystem bots, and modern React interfaces.", type: 'success', timestamp: '' },
        ];
        break;

      case 'skills':
        replyLines = [
          { text: "Direct skill vectors: [Progress representation]", type: 'info', timestamp: '' },
          { text: "  TypeScript    [████████████████░░░░] 85%", type: 'success', timestamp: '' },
          { text: "  JavaScript    [██████████████████░░] 90%", type: 'success', timestamp: '' },
          { text: "  React/Next.js [█████████████████░░░] 88%", type: 'success', timestamp: '' },
          { text: "  Python/ML     [██████████████░░░░░░] 75%", type: 'success', timestamp: '' },
          { text: "  Node/Express  [█████████████████░░░] 85%", type: 'success', timestamp: '' },
          { text: "  Java/OOP      [██████████████░░░░░░] 75%", type: 'success', timestamp: '' },
        ];
        break;

      case 'stats':
        replyLines = [
          { text: "Telemetry metrics from SpearsDevin Profile:", type: 'info', timestamp: '' },
          { text: `  Public Recs:   ${publicRepoCount} code modules`, type: 'success', timestamp: '' },
          { text: "  Discord Bots:  ClashBot (Active production status)", type: 'success', timestamp: '' },
          { text: "  ML Status:     GaugeDetection pointer analysis fully configured", type: 'success', timestamp: '' },
          { text: "  Server Ping:   100% responsive", type: 'success', timestamp: '' },
        ];
        break;

      case 'theme':
        if (!argument) {
          replyLines = [{ text: "Error: Please specify a theme. Example: 'theme matrix' or 'theme cyberpunk'.", type: 'error', timestamp: '' }];
        } else if (['slate', 'cyberpunk', 'matrix', 'sunset'].includes(argument)) {
          setTheme(argument as ThemeType);
          replyLines = [{ text: `System Theme Protocol updated successfully to [${argument.toUpperCase()}].`, type: 'success', timestamp: '' }];
        } else {
          replyLines = [{ text: `Error: Unknown theme '${argument}'. Available values: slate, cyberpunk, matrix, sunset.`, type: 'error', timestamp: '' }];
        }
        break;

      case 'email':
        replyLines = [
          { text: "Contact Vector Registered:", type: 'info', timestamp: '' },
          { text: "  Primary: devinspears2004@gmail.com", type: 'success', timestamp: '' },
          { text: "  Note: Direct recruiters, inquiries, or coffee invitations are validated instantly.", type: 'success', timestamp: '' },
        ];
        break;

      case 'socials':
        replyLines = [
          { text: "Live Social Nodes:", type: 'info', timestamp: '' },
          { text: "  GitHub:  https://github.com/SpearsDevin", type: 'success', timestamp: '' },
          { text: "  DevTo:   https://dev.to/spearsdevin", type: 'success', timestamp: '' },
        ];
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        replyLines = [
          { text: `Error: Command '${primaryCmd}' not recognized.`, type: 'error', timestamp: '' },
          { text: "Type 'help' to review available triggers.", type: 'info', timestamp: '' },
        ];
        break;
    }

    // Append responses with subtle staggered timing delay to simulate network ping
    setHistory((prev) => [
      ...prev,
      ...replyLines.map((line) => ({
        ...line,
        timestamp: new Date().toLocaleTimeString()
      }))
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? -1 : historyIndex + 1;
      if (nextIndex >= commandHistory.length || nextIndex === -1) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={focusInput}
      className={`rounded-2xl border shadow-2xl relative overflow-hidden flex flex-col h-80 cursor-text transition-all duration-300
        ${activeTheme === 'slate' ? 'bg-slate-950 border-slate-800 text-slate-100 shadow-slate-950/40' : ''}
        ${activeTheme === 'cyberpunk' ? 'bg-[#0a0214] border-[#ff0055]/20 text-pink-100 shadow-pink-950/5' : ''}
        ${activeTheme === 'matrix' ? 'bg-black border-[#00ff66]/20 text-[#00ff66] font-mono shadow-green-950/20' : ''}
        ${activeTheme === 'sunset' ? 'bg-zinc-950 border-amber-500/10 text-amber-50 shadow-amber-950/20' : ''}
      `}
    >
      {/* Title bar / Controls emulator */}
      <div className={`flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5 select-none`}>
        <div className="flex items-center gap-2">
          <Circle className="w-2.5 h-2.5 text-red-500 fill-current opacity-80" />
          <Circle className="w-2.5 h-2.5 text-yellow-500 fill-current opacity-80" />
          <Circle className="w-2.5 h-2.5 text-green-500 fill-current opacity-80" />
          <span className="text-xs font-mono opacity-50 ml-2">spearsdevin@cli:~</span>
        </div>
        <div className="flex items-center gap-1 opacity-60 text-[10px] font-mono">
          <TerminalIcon className="w-3.5 h-3.5 text-current" />
          <span>Interactive Protocol</span>
        </div>
      </div>

      {/* Terminal Outputs Canvas */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* Render lines */}
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`text-xs font-mono flex items-start gap-2 whitespace-pre-wrap leading-relaxed
              ${line.type === 'input' ? 'text-slate-100 opacity-90 font-medium' : ''}
              ${line.type === 'error' ? 'text-rose-400 font-semibold' : ''}
              ${line.type === 'success' ? (activeTheme === 'matrix' ? 'text-[#00ff66]' : 'text-slate-300') : ''}
              ${line.type === 'info' ? (activeTheme === 'cyberpunk' ? 'text-[#00ffff]' : 'text-slate-500') : ''}
            `}
          >
            <span className="opacity-30 select-none text-[10px] sm:inline mt-0.5">
              [{line.timestamp || 'CLI'}]
            </span>
            <span>{line.text}</span>
          </div>
        ))}
        <div ref={bottomRef} className="h-0" />
      </div>

      {/* Input bar emulator */}
      <form
        onSubmit={handleCommandSubmit}
        className="p-3 bg-black/50 border-t border-white/5 flex items-center gap-3 relative z-10"
      >
        <span className={`text-xs font-mono ml-1 flex items-center gap-1.5 font-semibold
          ${activeTheme === 'cyberpunk' ? 'text-[#ff0055]' : activeTheme === 'matrix' ? 'text-[#00ff66]' : 'text-slate-400'}
        `}>
          spearsdevin@cli:~$
        </span>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          id="terminal-input"
          placeholder="type 'help' or 'about'..."
          autoComplete="off"
          className="flex-1 bg-transparent border-none text-xs font-mono focus:outline-none placeholder-slate-600 focus:ring-0 text-white min-w-0"
        />

        <button
          type="submit"
          id="terminal-submit-btn"
          className={`p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 active:scale-95 transition-all text-xs flex items-center gap-1 cursor-pointer select-none font-mono
            ${activeTheme === 'matrix' ? 'text-[#00ff66] border-[#00ff66]/20' : ''}
          `}
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span className="hidden sm:inline">Enter</span>
        </button>
      </form>
    </div>
  );
}
