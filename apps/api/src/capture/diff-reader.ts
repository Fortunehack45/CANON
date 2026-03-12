import fetch from 'node-fetch';
import { logger } from '../lib/logger.js';

export interface DiffReaderResult {
  filesChanged: string[];
  additions: number;
  deletions: number;
  diffContent: string;
  category: 'chore' | 'feature' | 'fix' | 'refactor' | 'infra' | 'deps' | 'unknown';
}

export async function readDiff(diffUrl: string, installationToken?: string): Promise<DiffReaderResult> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3.diff' };
  if (installationToken) headers['Authorization'] = `token ${installationToken}`;

  let diffContent = '';
  try {
    const resp = await fetch(diffUrl, { headers });
    diffContent = await resp.text();
  } catch (err) {
    logger.warn({ err }, 'Failed to fetch diff, using empty');
  }

  const filesChanged = [...diffContent.matchAll(/^diff --git a\/(.+) b\//gm)].map((m) => m[1]);
  const additions = (diffContent.match(/^\+(?!\+\+)/gm) || []).length;
  const deletions = (diffContent.match(/^-(?!--)/gm) || []).length;

  // Categorize the change
  const category = categorize(filesChanged, diffContent);

  return { filesChanged, additions, deletions, diffContent: diffContent.slice(0, 8000), category };
}

function categorize(files: string[], diff: string): DiffReaderResult['category'] {
  const allFiles = files.join(' ').toLowerCase();
  if (allFiles.includes('package.json') || allFiles.includes('package-lock.json')) return 'deps';
  if (allFiles.includes('dockerfile') || allFiles.includes('.yml') || allFiles.includes('terraform')) return 'infra';
  if (diff.match(/fix|bug|patch/i)) return 'fix';
  if (diff.match(/refactor|rename|restructure/i)) return 'refactor';
  if (allFiles.match(/test|spec|__test__/)) return 'chore';
  return 'feature';
}
