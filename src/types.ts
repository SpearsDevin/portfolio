/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GithubProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics?: string[];
  homepage?: string | null;
  size: number;
}

export type ThemeType = 'slate' | 'cyberpunk' | 'matrix' | 'sunset';

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  timestamp: string;
}

export interface CuratedProject {
  name: string;
  iconName: string;
  tags: string[];
  longDescription: string;
  difficulty?: string;
  role?: string;
  impact?: string;
}
