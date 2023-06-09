const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 获取今天日期转为字符串
  const today = new Date().toISOString().slice(0, 10);

  let mdContext = "## 每日prompt  "+today+"\n" + "<center class=\"half\">"

  // 获取 apiKey 通过 https://arthub.ai/assets/index.684ec127.js

  await page.goto('https://arthub.ai');

  const entries = await page.$$('div.relative.card.mb-12.h-fit.transition-transform.svelte-j8kxlt');
  for (let i = 0; i < entries.length; i++) {
    // console.log('index entry:', i);

    // Get the prompt text
    const prompts = await entries[i].$$('.svelte-j8kxlt.svelte-j8kxlt > p');
    if (prompts.length === 0) {
      console.log('could not find prompts element');
      continue;
    }

    let promptText = '';
    for (const prompt of prompts) {
      const text = await prompt.textContent();
      promptText += text;
    }
    console.log('promptText:', promptText);
    mdContext += `<p>${promptText}</p>\n`;

    const imgs = await entries[i].$$('.relative.z-10.w-full.rounded-md > div > img');
    if (imgs.length === 0) {
      console.log('could not find img element');
      continue;
    }

    for (const img of imgs) {
      const src = await img.getAttribute('src');
      console.log('src:', src);
      mdContext += `<img src="${src}" width="200"/>\n`;
    }
  }

  mdContext += '</center>';
  console.log('mdContext:', mdContext);

  // Write mdContext to file
  const fs = require('fs');
  fs.writeFileSync('README.md', mdContext, 'utf8');

  await browser.close();
})();
