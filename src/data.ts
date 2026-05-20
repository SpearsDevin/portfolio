/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GithubProfile, GithubRepo, CuratedProject } from './types';

// Real backup profile retrieved directly from live API
export const fallbackProfile: GithubProfile = {
  login: "SpearsDevin",
  id: 69259220,
  avatar_url: "https://avatars.githubusercontent.com/u/69259220?v=4",
  html_url: "https://github.com/SpearsDevin",
  name: "Devin Spears",
  bio: "Ayo!! My name's Devin, I'm 21 currently working as a Software Dev // Web Dev",
  location: "Missouri, USA",
  public_repos: 14,
  followers: 4,
  following: 7,
  created_at: "2020-08-05T17:13:18Z",
  updated_at: "2026-05-20T13:17:20Z"
};

// Curated definitions to enhance specific popular repositories
export const curatedProjects: Record<string, CuratedProject> = {
  "ClashBot": {
    name: "ClashBot",
    iconName: "Shield",
    tags: ["Discord.js", "Node.js", "REST API", "JavaScript", "Gaming"],
    longDescription: "A fully operational Discord assistant leveraging the official Clash of Clans REST API. It fetches real-time player credentials, screens ongoing clan wars, and alerts subsectors about war stats or participant details directly into organized Discord server channels.",
    difficulty: "Intermediate",
    role: "Lead API Architect",
    impact: "Active server integration with over 40+ clan participants sync"
  },
  "GaugeDetection": {
    name: "GaugeDetection",
    iconName: "Maximize",
    tags: ["Python", "TensorFlow", "Computer Vision", "OpenCV", "Deep Learning"],
    longDescription: "An advanced computer vision system targeted at industrial safety equipment digitization. Employs trained TensorFlow deep learning models to pinpoint analog dashboard pointers, locate measurement dial ticks, and compute system levels.",
    difficulty: "Advanced",
    role: "Computer Vision Engineer",
    impact: "Digitized 94%+ edge-case analog dials across testing cycles"
  },
  "MbrllaHacks-Website": {
    name: "MbrllaHacks Website",
    iconName: "Umbrella",
    tags: ["JavaScript", "HTML5", "CSS3", "Event Platform", "Microinteractions"],
    longDescription: "A bespoke event landing site designed for local tech hackathons. Implements rich grid layouts, custom SVG imagery, modern keyframe alignments, responsive scheduling drawers, and a distinct aesthetic centered on umbrella symbolism.",
    difficulty: "Intermediate",
    role: "Frontend Specialist",
    impact: "Responsive platform supporting live user registrations"
  },
  "Personal-Projects": {
    name: "Personal Projects",
    iconName: "FolderCode",
    tags: ["JavaScript", "CSS3 Animations", "DOM Manipulation", "Sandbox"],
    longDescription: "Devin's comprehensive development launchpad compiling utilities, experimental UI nodes, custom algorithms, and layout proofs. Functions as a core testbed for refining reactive state scripts and vector animation rules.",
    difficulty: "Sandbox",
    role: "Full Stack Creator",
    impact: "Over 80+ dynamic mini-codes and visual modules stored"
  },
  "AP-Computer-Science": {
    name: "AP Computer Science",
    iconName: "GraduationCap",
    tags: ["Java", "OOP Design Principles", "Recursion", "Data Structures"],
    longDescription: "A repository compiling rigorous academic codebases from AP Class training. Demonstrates expertise in sorting algorithms, binary hierarchies, list traversals, and abstract class models built in Java.",
    difficulty: "Academic",
    role: "Developer",
    impact: "Score verification and rigorous recursive module sets"
  },
  "Automation": {
    name: "Automation Node",
    iconName: "Cpu",
    tags: ["Python", "Bash", "OS Scripting", "Scheduler", "API Triggers"],
    longDescription: "A framework of automation scripts in Python designed to eliminate redundant manual tasks. Handles background operating system sweeps, standard backups, and triggers cron events based on live API parameters.",
    difficulty: "Intermediate",
    role: "Automation Engineer",
    impact: "Eliminated repetitive file setups and daily testing pipeline resets"
  }
};

// Fallback repo array to bypass API exhaustion and load instantly
export const fallbackRepos: GithubRepo[] = [
  {
    id: 630055927,
    name: "ClashBot",
    full_name: "SpearsDevin/ClashBot",
    html_url: "https://github.com/SpearsDevin/ClashBot",
    description: "This discord bot uses the Clash Of Clans API to get information about a player, clan and current events. It has various commands to keep the clan up to date on whats happening.",
    language: "JavaScript",
    stargazers_count: 5,
    forks_count: 1,
    updated_at: "2026-05-18T10:00:00Z",
    created_at: "2023-04-19T15:16:04Z",
    topics: ["discord-bot", "clash-of-clans", "api-wrapper", "javascript-core"],
    size: 27
  },
  {
    id: 578249812,
    name: "GaugeDetection",
    full_name: "SpearsDevin/GaugeDetection",
    html_url: "https://github.com/SpearsDevin/GaugeDetection",
    description: "Using TensorFlow computer vision frameworks to process gauge readings and detect metric indices.",
    language: "Python",
    stargazers_count: 3,
    forks_count: 0,
    updated_at: "2026-05-15T14:22:00Z",
    created_at: "2022-12-14T15:56:42Z",
    topics: ["computer-vision", "tensorflow", "opencv", "python-ai"],
    size: 12841
  },
  {
    id: 513920123,
    name: "MbrllaHacks-Website",
    full_name: "SpearsDevin/MbrllaHacks-Website",
    html_url: "https://github.com/SpearsDevin/MbrllaHacks-Website",
    description: "Responsive registration showcase portal and timetable designed for the local region's hackathon series.",
    language: "JavaScript",
    stargazers_count: 2,
    forks_count: 0,
    updated_at: "2026-05-01T12:11:00Z",
    created_at: "2022-07-14T13:51:16Z",
    topics: ["hackathon", "responsive-ui", "javascript-dom", "event-planner"],
    size: 35198
  },
  {
    id: 355238509,
    name: "Personal-Projects",
    full_name: "SpearsDevin/Personal-Projects",
    html_url: "https://github.com/SpearsDevin/Personal-Projects",
    description: "Central sandbox storing customized user interfaces, front-end dashboards, and playground widgets.",
    language: "JavaScript",
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2026-05-19T11:45:00Z",
    created_at: "2021-04-06T15:26:06Z",
    topics: ["portfolio", "experimental-web", "animations-sandbox"],
    size: 88046
  },
  {
    id: 403677430,
    name: "AP-Computer-Science",
    full_name: "SpearsDevin/AP-Computer-Science",
    html_url: "https://github.com/SpearsDevin/AP-Computer-Science",
    description: "This is all of my class work from my AP Computer Science class in high school, it's a College level class available to high schoolers",
    language: "Java",
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2022-09-05T14:49:53Z",
    created_at: "2021-09-06T15:44:05Z",
    topics: ["java", "ap-comp-sci", "algorithms", "data-structures"],
    size: 7940
  },
  {
    id: 595307307,
    name: "Automation",
    full_name: "SpearsDevin/Automation",
    html_url: "https://github.com/SpearsDevin/Automation",
    description: "System tools and daily workflow auto-schedulers written to simplify workspace operations.",
    language: "Python",
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2025-10-08T13:56:20Z",
    created_at: "2023-01-30T20:20:23Z",
    topics: ["automation", "python-scripts", "sysadmin", "utilities"],
    size: 2
  }
];

export const skillsList = [
  { name: "JavaScript / ES6+", level: 90, category: "Frontend" },
  { name: "TypeScript", level: 85, category: "Frontend" },
  { name: "React / Next.js", level: 88, category: "Frontend" },
  { name: "Python", level: 80, category: "Backend & ML" },
  { name: "Node.js / Express", level: 85, category: "Backend" },
  { name: "Java OOP", level: 75, category: "Backend" },
  { name: "TensorFlow & CV", level: 70, category: "Backend & ML" },
  { name: "Tailwind CSS", level: 92, category: "Frontend" },
  { name: "Clash Bot & Discord SDK", level: 85, category: "Integrations" },
  { name: "Git / CI Deployments", level: 82, category: "Integrations" }
];

export const timelineExperience = [
  {
    period: "Oct 2020 - Present",
    title: "Software Developer / Project Manager",
    company: "Mid Central Technologies (Anderson, MO)",
    description: "Engineered backend efficiency improvements of 70% on the company website by implementing streamlined workflows and optimizing code architecture. Managed end-to-end project timelines and resource allocation for diverse software integration projects, consistently ensuring on-time delivery and optimizing efficiency. Developed and deployed highly performant, scalable applications."
  },
  {
    period: "May 2025 - Present",
    title: "Design Specialist / Owner",
    company: "Novemo Studio (Self-employed • Neosho, MO)",
    description: "Spearheading 3D Manufacturing & Design projects. Delivering specialized digital design solutions, parametric visual modeling, and custom engineering design integrations."
  },
  {
    period: "Apr 2022 - Oct 2022",
    title: "Front-End Developer (6-month Internship)",
    company: "MbrllaHacks (Remote)",
    description: "Achieved a 43% improvement in web runtime and loading speeds through strategic performance tuning. Elevated user experience (UX) by implementing captivating Parallax Effects with JavaScript, CSS, and React.js. Collaborated with a remote team to engineer highly maintainable code solutions."
  }
];
