const assert = require('node:assert/strict');
const { mkdirSync } = require('node:fs');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  mkdirSync('artifacts/screenshots', { recursive: true });
  try {
    const context = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, reducedMotion: 'reduce'});
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.addInitScript(() => {
      if (localStorage.getItem('wk-fixture')) return;
      localStorage.setItem('wk-fixture', '1');
      localStorage.setItem('wonderkids:v2', JSON.stringify({
        name: 'Mira', age: 5, avatar: '🦁', stickers: ['🦖'],
        stats: { phonics: {xp: 14, streak: 2, correct: 14, attempts: 16} },
      }));
    });
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForFunction(() => 'serviceWorker' in navigator);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const btn = (name) => page.getByRole('button', {name, exact: true});
    const shot = async name => {
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images, img => img.decode().catch(() => {})));
      });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, name);
      await page.screenshot({path: 'artifacts/screenshots/' + name + '.jpg', type: 'jpeg', quality: 88, fullPage: true});
    };
    await btn('English').click();
    await btn('A').click();
    await btn('Continue').click();
    await btn('Play sound').click();
    await page.getByRole('status').filter({hasText:'Audio is unavailable'}).waitFor();
    await btn('Continue').click();
    await shot('english');
    await btn('Continue').click();
    await btn('Play game').click();
    await shot('picture-game');
    await btn('hat').count().then(async count => {
      if (count) await btn('hat').click();
      else await page.locator('.wk-answer').filter({has: page.locator('img:not([alt="apple"])')}).first().click();
    });
    await page.getByRole('status').filter({hasText:'try again'}).waitFor();
    await btn('apple').click();
    await btn('Continue').click();
    await btn('Finish practice').click();
    await page.getByText('You earned 1 star and 10 XP.').waitFor();
    await btn('Next lesson').click();
    await page.getByText('Meet today’s lesson').waitFor();
    await btn('தமிழ்').click();
    await page.getByRole('combobox').selectOption('க் வரிசை');
    assert.equal(await page.locator('.wk-lessons button').count(), 12);
    await btn('கா').click();
    await btn('Continue').click();
    await page.getByText('க் + ஆ → கா').waitFor();
    await shot('tamil');
    await btn('हिन्दी').click();
    await btn('आ').click();
    await btn('Continue').click();
    await btn('Continue').click();
    await shot('hindi');
    await context.setOffline(true);
    await page.reload();
    await btn('हिन्दी').click();
    await btn('Start lesson').click();
    await btn('Continue').click();
    await btn('Continue').click();
    await page.locator('img[alt="आम"]').evaluate(img => img.decode());
    await btn('Course').click();
    await btn('Home').click();
    await btn('Parent dashboard').click();
    await page.getByText(/1 \/ \d+ completed · 1 stars · 10 XP/).waitFor();
    await btn('Home').click();
    await page.getByRole('button', {name:/Phonics/}).first().click();
    await page.getByRole('button', {name:/Letter Sounds/}).click();
    await page.getByRole('heading', {name:/Letter Sounds/}).waitFor();
    const previous = await page.evaluate(() => JSON.parse(localStorage.getItem('wonderkids:v2')));
    assert.equal(previous.stats.phonics.xp, 14);
    assert.equal(previous.id, 'original');
    await page.setViewportSize({width: 768, height: 1024});
    await page.reload();
    await btn('Switch player').click();
    await page.getByRole('button', {name:/Mira/}).click();
    await btn('Parent dashboard').click();
    await page.getByText(/1 \/ \d+ completed · 1 stars · 10 XP/).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(pageErrors, []);
    console.log('Production browser checks passed: guided lesson, wrong answer retry, rewards, Tamil unit, Hindi image offline, profile migration, legacy phonics, player switch, phone/tablet widths.');
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
