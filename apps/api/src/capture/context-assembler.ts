import { readDiff, DiffReaderResult } from './diff-reader.js';

export interface AssembledContext {
  prNumber: number;
  repo: string;
  prTitle: string;
  prBody: string;
  authorLogin: string;
  mergedAt: string;
  diff: DiffReaderResult;
  linkedTicketContext?: string;
}

interface AssembleOptions {
  prNumber: number;
  repo: string;
  prTitle: string;
  prBody: string;
  authorLogin: string;
  mergedAt: string;
  diffUrl: string;
  installationToken?: string;
  jiraTicketId?: string;
}

export async function assembleContext(opts: AssembleOptions): Promise<AssembledContext> {
  const diff = await readDiff(opts.diffUrl, opts.installationToken);

  return {
    prNumber: opts.prNumber,
    repo: opts.repo,
    prTitle: opts.prTitle,
    prBody: opts.prBody || '',
    authorLogin: opts.authorLogin || 'unknown',
    mergedAt: opts.mergedAt,
    diff,
  };
}
