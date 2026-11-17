'use strict';
const localHost = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
document.getElementById('local-review').hidden = !localHost;
const videos = Array.from(document.querySelectorAll('video'));
const status = document.getElementById('playback-status');
document.querySelectorAll('[data-video]').forEach(button => {
  const video = document.getElementById(button.dataset.video);
  const label = button.dataset.label;
  button.addEventListener('click', async () => {
    if (!video.paused) { video.pause(); return; }
    if (video.ended) video.currentTime = 0;
    try { await video.play(); }
    catch { status.textContent = 'Tap the video’s own Play button, or use “Open clip separately.”'; }
  });
  video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
    button.textContent = `Pause ${label}`;
    status.textContent = `Playing ${label}. Game sound is included; check the player and device volume if needed.`;
  });
  video.addEventListener('pause', () => {
    button.textContent = `${video.ended ? 'Replay' : 'Play'} ${label}`;
  });
  video.addEventListener('ended', () => {
    button.textContent = `Replay ${label}`;
    status.textContent = `${label.charAt(0).toUpperCase() + label.slice(1)} finished.`;
  });
  video.addEventListener('error', () => {
    status.textContent = 'The clip could not load. Please use “Open clip separately.”';
  });
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) videos.forEach(video => video.pause());
});
