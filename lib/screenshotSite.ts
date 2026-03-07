import puppeteer from "puppeteer";

export async function screenshotSite(url: string): Promise<Buffer> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    // Simulate high res aspect ratio (e.g. 1920x1080)
    await page.setViewport({ width: 1920, height: 1080 });

    // Attempt to go to the page
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const screenshotBuffer = await page.screenshot({ type: "png" });

    return Buffer.from(screenshotBuffer);
  } catch (error) {
    console.error("Failed to take screenshot of:", url, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
