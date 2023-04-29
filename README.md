# Vimeo Track Completion

## Description
Track the completion of an embedded Vimeo video by a user (to present a certificate of completion, for example).

It tracks how much time the video has been watched and displays a message when the user has watched a certain percentage of the video.



## Usage
1. Add the Vimeo API script to your HTML:
```html
<script src="https://player.vimeo.com/api/player.js"></script>
```

2. Add the vimeo-track-completion.js file to your project and include it in your HTML below the Vimeo API script:
```html
<script src="vimeo-track-completion.js"></script>
```

3. Change the `VIDEO_ID` constant in vimeo-track-complete.js to the Vimeo video ID you want to track:
```javascript
// const VIDEO_ID = ''; // for the first video
const VIDEO_ID = '235215203'; // '' for a specfic video (replace with your video id)
```

4. Change the `WATCHED_PERCENTAGE_THRESHOLD` constant in vimeo-track-completion.js to the percentage of the video you want to track:
```javascript
const WATCHED_PERCENTAGE_THRESHOLD = 80; // 80% of the video
```

5. Modify the placeholder HTML in displayCompletionInstructions() in vimeo-track-completion.js to whatever you want. 
```javascript
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


