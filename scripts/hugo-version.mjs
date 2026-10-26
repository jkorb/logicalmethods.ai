import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function matchesHugoVersion(output, expected) {
  // Official releases include a commit hash; packaged builds may omit it.
  const match = output.match(/^hugo v(\d+\.\d+\.\d+)(?:-[0-9a-f]+)?(?:\+[\w+]+)?(?:\s|$)/);
  return match?.[1] === expected;
}

// Keep a pinned executable in the worktree when the system version differs.
// Homebrew may also retain the required release after upgrading PATH's binary.
export function resolveHugoVersion(expected, {
  run = spawnSync, list = readdirSync, platform = process.platform
} = {}) {
  const inspect = command => run(command, ['version'], { encoding: 'utf8' });
  const installed = inspect('hugo');
  if (installed.status === 0 && matchesHugoVersion(installed.stdout, expected)) return 'hugo';
  const local = resolve('tmp', 'bin', 'hugo', expected, platform === 'win32' ? 'hugo.exe' : 'hugo');
  const cached = inspect(local);
  if (cached.status === 0 && matchesHugoVersion(cached.stdout, expected)) return local;
  if (platform === 'darwin') {
    const cellar = run('brew', ['--cellar', 'hugo'], { encoding: 'utf8' });
    if (cellar.status === 0) {
      const directory = cellar.stdout.trim();
      let releases = [];
      try { releases = list(directory); } catch { /* Hugo may not be installed through Homebrew. */ }
      for (const release of releases.filter(name => name === expected || name.startsWith(`${expected}_`)).sort().reverse()) {
        const command = join(directory, release, 'bin', 'hugo');
        const candidate = inspect(command);
        if (candidate.status === 0 && matchesHugoVersion(candidate.stdout, expected)) return command;
      }
    }
  }
  throw new Error(`Use Hugo ${expected} (see .hugo-version). Found: ${installed.stdout?.trim() || installed.error?.message || 'no usable Hugo executable'}\nInstall the matching extended executable at ${local} or on PATH; see docs/testing/first-time-setup.md.`);
}
