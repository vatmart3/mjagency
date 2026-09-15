/* Rendu vidéo, méthode retenue.
   - Playwright enregistre (c'est lui qui rend le plus d'images).
   - Les dimensions de la fenêtre sont imposées par CDP : sans cela la
     fenêtre réelle fait 993 pixels de haut et l'enregistreur ajoute une
     bande grise en bas.
   - Le film est retenu au chargement (?capture) puis déclenché une fois
     l'enregistrement en route : on sait donc où il commence, et on
     recoupe ensuite l'amorce.
   - Il joue au quart de sa vitesse, transitions comprises ; le montage
     accélère d'autant. */
const { chromium } = require('playwright-core');
(async () => {
  const [url, secondes, dossier] = process.argv.slice(2);
  const R = 0.25, AMORCE = 1.0;          // seconde d'amorce, recoupée au montage
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--no-sandbox','--hide-scrollbars','--force-device-scale-factor=1'] });
  const ctx = await b.newContext({ viewport:{width:1920,height:1080},
    recordVideo:{ dir: dossier, size:{width:1920,height:1080} } });
  const p = await ctx.newPage();
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setDeviceMetricsOverride',
    { width:1920, height:1080, deviceScaleFactor:1, mobile:false });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(url + '?capture&vitesse=' + R);
  await p.waitForFunction(() => typeof window.__demarrer === 'function');
  await p.waitForTimeout(AMORCE * 1000);
  await p.evaluate(() => window.__demarrer());
  await p.waitForTimeout((+secondes) / R * 1000);
  await ctx.close(); await b.close();
  console.log('amorce', AMORCE, 's — erreurs :', errs.length ? errs : 'aucune');
})();
