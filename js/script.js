const VIDEO_ID = '817783353';
const WATCHED_PERCENTAGE_THRESHOLD = 80;

const createVimeoPlayer = (selector, videoId) => {
  return new Vimeo.Player(document.querySelector(selector), { id: videoId });
};

const displayCompletionInstructions = () => {
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
};

const checkThresholdReached = (accumulatedTime, videoDuration) => {
  if (videoDuration === null) {
    return;
  }

  const percentageWatched = (accumulatedTime / videoDuration) * 100;
  const thresholdReached = percentageWatched >= WATCHED_PERCENTAGE_THRESHOLD;

  const instructionsElement = document.getElementById('completion-instructions');

  if (thresholdReached && !instructionsElement) {
    displayCompletionInstructions();
  } else if (!thresholdReached && instructionsElement) {
    instructionsElement.remove();
  }
};

const handleTimeUpdate = (data, context) => {
  if (context.lastUpdateTime !== null) {
    const currentTime = data.seconds;
    const deltaTime = (currentTime - context.lastUpdateTime) * context.playbackRate;
    const seekThreshold = 5;

    if (deltaTime > 0 && deltaTime < seekThreshold) {
      context.accumulatedTime += deltaTime;
      localStorage.setItem('accumulatedTime', context.accumulatedTime);
      checkThresholdReached(context.accumulatedTime, context.videoDuration);
    }
  }
  context.lastUpdateTime = data.seconds;
};

document.addEventListener('DOMContentLoaded', () => {
  const player = createVimeoPlayer('iframe', VIDEO_ID);
  const context = {
    accumulatedTime: parseFloat(localStorage.getItem('accumulatedTime')) || 0,
    playbackRate: 1,
    lastUpdateTime: null,
    videoDuration: null,
  };

  player.getDuration().then((duration) => {
    context.videoDuration = duration;
    checkThresholdReached(context.accumulatedTime, context.videoDuration);
  });

  player.on('timeupdate', (data) => handleTimeUpdate(data, context));
  player.on('ratechange', (data) => (context.playbackRate = data.playbackRate));
  player.on('seeked', () => (context.lastUpdateTime = null));
  player.on('ended', () => (context.lastUpdateTime = null));
  player.on('pause', () => (context.lastUpdateTime = null));
});
