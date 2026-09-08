import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesHugoVersion } from '../../scripts/hugo-version.mjs';

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
