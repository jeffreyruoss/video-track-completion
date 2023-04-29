// Replace VIDEO_ID with your Vimeo video ID
const VIDEO_ID = '817783353';
const WATCHED_PERCENTAGE_THRESHOLD = 90; // Change this value to set the desired threshold

const player = new Vimeo.Player(document.querySelector('iframe'), { id: VIDEO_ID });

function onAccumulatedTimeReachedThreshold() {
  // Display instructions on how to claim the certificate of completion
  const instructions = `
    <div id="completion-instructions">
      <h2>Congratulations!</h2>
      <p>You have watched over ${WATCHED_PERCENTAGE_THRESHOLD}% of the video. To claim your certificate of completion, please follow the instructions below:</p>
      <ol>
        <li>Step 1: Do this</li>
        <li>Step 2: Do that</li>
        <li>Step 3: Do something else</li>
      </ol>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', instructions);
}

function checkThresholdReached(accumulatedTime, videoDuration) {
  if (videoDuration === null) {
    return;
  }

  const percentageWatched = (accumulatedTime / videoDuration) * 100;
  const thresholdReached = percentageWatched >= WATCHED_PERCENTAGE_THRESHOLD;

  const instructionsElement = document.getElementById('completion-instructions');

  if (thresholdReached && !instructionsElement) {
    onAccumulatedTimeReachedThreshold();
  } else if (!thresholdReached && instructionsElement) {
    instructionsElement.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const player = new Vimeo.Player(document.querySelector('iframe'), { id: VIDEO_ID });
  let accumulatedTime = parseFloat(localStorage.getItem('accumulatedTime')) || 0;
  let playbackRate = 1;
  let lastUpdateTime = null;
  let videoDuration = null;

  player.getDuration().then((duration) => {
    videoDuration = duration;
    checkThresholdReached(accumulatedTime, videoDuration);
  });

  player.on('timeupdate', (data) => {
    if (lastUpdateTime !== null) {
      const currentTime = data.seconds;
      const deltaTime = (currentTime - lastUpdateTime) * playbackRate;
      
      if (deltaTime > 0) {
        accumulatedTime += deltaTime;
        localStorage.setItem('accumulatedTime', accumulatedTime);
        checkThresholdReached(accumulatedTime, videoDuration);
      }
    }
    lastUpdateTime = data.seconds;
  });

  player.on('ratechange', (data) => {
    playbackRate = data.playbackRate;
  });

  player.on('seeked', () => {
    lastUpdateTime = null;
  });

  player.on('ended', () => {
    lastUpdateTime = null;
  });

  player.on('pause', () => {
    lastUpdateTime = null;
  });
});
