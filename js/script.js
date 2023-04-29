const VIDEO_ID = '235215203';
const WATCHED_PERCENTAGE_THRESHOLD = 80;

const createVimeoPlayer = (videoId) => {
  const iframeElement = Array.from(document.querySelectorAll('iframe')).find(iframe =>
    iframe.src.includes(videoId)
  );

  return new Vimeo.Player(iframeElement, { id: videoId });
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
    const deltaTime = ((currentTime - context.lastUpdateTime) * context.playbackRate) / context.playbackRate;

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
  const player = createVimeoPlayer(VIDEO_ID);
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
