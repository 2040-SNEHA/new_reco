const puppeteer = require('puppeteer');

async function runPuppeteerScript(page) {
  try {
    const browser = page.browser();

    const recordingPage = await browser.newPage();
    await recordingPage.goto('file:///E:/xper_puppeteer_1/recording.html');

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

    /*await recordingPage.exposeFunction('reportEvent', async (info) => {
      if (info.targetId == 'baba') {
        //console.log(info)
        console.log(JSON.stringify(info)); // Log the message in Puppeteer context
        await recordingPage.evaluate((message) => {
          // Call the function on the front-end to display the message
          displayMessages();
        }, JSON.stringify(info));
      }
    });*/

    await recordingPage.evaluateOnNewDocument(() => {
      const getInnerText = element => {
        // Check if the element has a 'value' property (e.g., for input fields)
        if ('value' in element) {
          return element.value;
        }

        // Check if the element has a 'textContent' property (e.g., for elements with child nodes)
        if ('textContent' in element) {
          return element.textContent;
        }

        // If all else fails, return an empty string
        return '';
      };

      const getUniqueSelector = element => {
        if (!(element instanceof Element)) return;
        const path = [];
        while (element.nodeType === Node.ELEMENT_NODE) {
          let selector = element.nodeName.toLowerCase();
          if (element.id) {
            selector += `#${element.id}`;
            path.unshift(selector);
            break;
          } else {
            let sibling = element;
            let siblingIndex = 1;
            while (sibling = sibling.previousElementSibling) {
              if (sibling.nodeName.toLowerCase() === selector) siblingIndex++;
            }
            if (siblingIndex !== 1) selector += `:nth-of-type(${siblingIndex})`;
          }
          path.unshift(selector);
          element = element.parentNode;
        }
        return path.join(' > ');
      };
      const reportElementDetails = (element, eventType) => {
        // Get the tag name of the element
        const tagName = element.tagName;

        // Get the inner text of the element
        const innerText = getInnerText(element);

        // Get the href attribute value of the element (if it's an anchor element)
        const href = (tagName.toLowerCase() === 'a') ? element.getAttribute('href') : '';

        // Get the unique selector of the element
        const selector = getUniqueSelector(element);

        // Report the details of the element
        reportEvent({
          innerText,
          href: element.baseURI,
          eventType,
          selector, // Add the selector to the report
        });
      };

      window.addEventListener('click', e => {
        reportElementDetails(e.target, 'click');
      }, true /* capture */);

      window.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const activeElement = document.activeElement;
          reportElementDetails(activeElement, 'keydown');
        }
      });
    });

    await recordingPage.exposeFunction('reportEvent1', async (info) => {
      if (1 == 1) {
        //console.log(info)
        console.log(JSON.stringify(info)); // Log the message in Puppeteer context
        await recordingPage.evaluate((message) => {
          // Call the function on the front-end to display the message
          printToConsole(message);
        }, JSON.stringify(info));
      }
    });
    await recordingPage.evaluateOnNewDocument(() => {
      window.addEventListener('input', e => {
        // Get the input element that triggered the event
        const inputElement = e.target;
        
    
        // Get the input value from the element
        const inputValue = inputElement.value;
    
        // Get the aria label attribute value (if available)
        const ariaLabel = inputElement.getAttribute('aria-label') || '';
    
        // Get the default value attribute (if available)
        const defaultValue = inputElement.getAttribute('defaultValue') || '';
    
        // Report the input value along with ariaLabel and defaultValue
        reportEvent1({
          targetName: inputValue,
          //eventType: 'input',
          ariaLabel,
          defaultValue,
          
        });
      }, true /* capture */);
    });
  
    await recordingPage.exposeFunction('scrollEvent', async (info) => {
      if (1 == 1) {
        //console.log(info)
        console.log(JSON.stringify(info)); // Log the message in Puppeteer context
        await recordingPage.evaluate((message) => {
          // Call the function on the front-end to display the message
          printToConsole(message);
        }, JSON.stringify(info));
      }
    });
    await recordingPage.evaluateOnNewDocument(() => {
      window.addEventListener('scroll', () => {
        scrollEvent({
          eventType: 'scroll',
          scrollX: window.scrollX,
          scrollY: window.scrollY,
        });
      });
    });

    // Navigate to the recording.html URL in a new tab

  } catch (err) {
    console.error('Error executing Puppeteer script:', err);
  }
}

// Export the runPuppeteerScript function
module.exports = runPuppeteerScript;
