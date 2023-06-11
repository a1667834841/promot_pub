const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 获取今天日期 往后的8个小时
  const today = dateFormat(new Date(), 'yyyy-MM-dd')


  let mdContext = "## 每日prompt"+"\n"+"### "+today+"\n" + "<center class=\"half\">"

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

    // 添加下划线
    mdContext += '<hr>\n';
  }

  mdContext += '</center>';
  console.log('mdContext:', mdContext);

  // Write mdContext to file
  const fs = require('fs');
  fs.writeFileSync('README.md', mdContext, 'utf8');

  await browser.close();
})();


function dateFormat (date, format) {
  date = new Date(date);
  var o = {
      'M+' : date.getMonth() + 1, //month
      'd+' : date.getDate(), //day
      'H+' : date.getHours()+8, //hour+8小时
      'm+' : date.getMinutes(), //minute
      's+' : date.getSeconds(), //second
      'q+' : Math.floor((date.getMonth() + 3) / 3), //quarter
      'S' : date.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format))
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

  for (var k in o)
      if (new RegExp('(' + k + ')').test(format))
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));

  return format;
}
