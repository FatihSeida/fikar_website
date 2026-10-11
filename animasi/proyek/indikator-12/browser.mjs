import { chromium } from 'playwright-core';
const launch = chromium.launch.bind(chromium);
chromium.launch = opts => launch({ ...opts, channel: 'chrome', ignoreDefaultArgs: ['--headless=old'], args: [...(opts?.args ?? []), '--headless=new'] });
