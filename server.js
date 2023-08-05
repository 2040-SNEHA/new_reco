const puppeteer = require('puppeteer');

async function runPuppeteerScript(page) {
  try {
    const browser = page.browser();

    const recordingPage = await browser.newPage();
    await recordingPage.goto('file:///Users/balamurug.palanisamy/Git_sneha/new_reco/recording.html');

    await recordingPage.exposeFunction('redirectEvent1', async (info) => {
      console.log('redirectEvent1 called:', info); // Log the info to see if the function is being called
      if (info.targetId == 'submit') {
        console.log(info.targetValue);
        await recordingPage.goto(info.targetValue);
      }
    });

    await recordingPage.evaluate(() => {
      document.addEventListener('click', e => {
        console.log('Click event triggered:', e); // Log the event to see if the click event is being triggered
        window.redirectEvent1({
          targetId: e.target.getAttribute("id"),
          targetValue: document.getElementById("url").value
        });
      }, true /* capture */);
    });

    // Navigate to the recording.html URL in a new tab

  } catch (err) {
    console.error('Error executing Puppeteer script:', err);
  }
}

// Export the runPuppeteerScript function
module.exports = runPuppeteerScript;
