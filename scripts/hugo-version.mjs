export function matchesHugoVersion(output, expected) {
  // Official releases include a commit hash; packaged builds may omit it.
  const match = output.match(/^hugo v(\d+\.\d+\.\d+)(?:-[0-9a-f]+)?(?:\+[\w+]+)?(?:\s|$)/);
  return match?.[1] === expected;
}
