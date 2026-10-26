import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { matchesHugoVersion, resolveHugoVersion } from '../../scripts/hugo-version.mjs';

test('Hugo version guard accepts official and packaged releases', () => {
  for (const output of [
    'hugo v0.165.0-76a5e1880ab46688155b02e99bab9be2a6134492+extended linux/amd64 BuildDate=2026-08-12T14:26:28Z VendorInfo=gohugoio',
    'hugo v0.165.0+extended+withdeploy darwin/arm64 BuildDate=2026-08-12T14:26:28Z VendorInfo=Homebrew',
    'hugo v0.165.0 linux/amd64',
    'hugo v0.165.0-76a5e188 linux/amd64',
  ]) assert.equal(matchesHugoVersion(output, '0.165.0'), true, output);
});

test('Hugo version guard rejects other versions, prereleases and malformed output', () => {
  for (const output of [
    'hugo v0.164.0+extended linux/amd64',
    'hugo v0.165.1-76a5e188+extended linux/amd64',
    'hugo v0.165.00 linux/amd64',
    'hugo v0.165.0-rc.1+extended linux/amd64',
    'hugo v0.165.0garbage linux/amd64',
    'unexpected output',
  ]) assert.equal(matchesHugoVersion(output, '0.165.0'), false, output);
});

const release = version => ({ status: 0, stdout: `hugo v${version}+extended darwin/arm64` });
const local = (platform = process.platform) => resolve('tmp', 'bin', 'hugo', '0.167.0', platform === 'win32' ? 'hugo.exe' : 'hugo');

test('Hugo selection uses the matching PATH binary without consulting Homebrew', () => {
  assert.equal(resolveHugoVersion('0.167.0', {
    run(command) { assert.equal(command, 'hugo'); return release('0.167.0'); }
  }), 'hugo');
});

test('Hugo selection finds and verifies a retained Homebrew release after an upgrade', () => {
  assert.equal(resolveHugoVersion('0.167.0', {
    platform: 'darwin',
    list: () => ['0.168.0', '0.167.0_1'],
    run(command) {
      if (command === 'hugo') return release('0.168.0');
      if (command === local('darwin')) return { status: null, error: new Error('ENOENT') };
      if (command === 'brew') return { status: 0, stdout: '/opt/homebrew/Cellar/hugo\n' };
      assert.equal(command, '/opt/homebrew/Cellar/hugo/0.167.0_1/bin/hugo');
      return release('0.167.0');
    }
  }), '/opt/homebrew/Cellar/hugo/0.167.0_1/bin/hugo');
});

test('Hugo selection uses a verified local release when PATH is missing or newer', () => {
  for (const platform of ['darwin', 'linux', 'win32']) {
    for (const installed of [release('0.168.0'), { status: null, error: new Error('ENOENT') }]) {
      assert.equal(resolveHugoVersion('0.167.0', {
        platform,
        run(command) {
          if (command === 'hugo') return installed;
          assert.equal(command, local(platform));
          return release('0.167.0');
        }
      }), local(platform));
    }
  }
});

test('Hugo selection rejects an unusable local binary and explains how to install one', () => {
  assert.throws(() => resolveHugoVersion('0.167.0', {
    platform: 'linux',
    run(command) {
      if (command === 'hugo') return release('0.168.0');
      assert.equal(command, local('linux'));
      return { status: 1, stdout: release('0.167.0').stdout };
    }
  }), error => {
    assert.match(error.message, /Use Hugo 0\.167\.0/);
    assert.ok(error.message.includes(local('linux')));
    assert.match(error.message, /docs\/testing\/first-time-setup\.md/);
    return true;
  });
});

test('Hugo selection rejects wrong versions in PATH, the local cache, and Homebrew', () => {
  for (const platform of ['darwin', 'linux']) {
    assert.throws(() => resolveHugoVersion('0.167.0', {
      platform, list: () => ['0.167.0'],
      run(command) {
        if (command === 'brew') {
          assert.equal(platform, 'darwin');
          return { status: 0, stdout: '/opt/homebrew/Cellar/hugo' };
        }
        return release('0.168.0');
      }
    }), /Use Hugo 0\.167\.0/);
  }
});
