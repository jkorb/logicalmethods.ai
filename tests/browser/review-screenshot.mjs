// Review artifacts are opt-in; functional pixel assertions use screenshot directly.
export async function reviewScreenshot(target, options) {
  if (process.env.REVIEW_SCREENSHOTS !== '1') return;
  await target.screenshot(options);
}
