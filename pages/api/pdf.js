import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

<<<<<<< HEAD
export const config = {
  api: { responseLimit: "10mb" },
  // Required: tells Vercel to give this function more memory/time for PDF gen
  maxDuration: 30,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Fix: was missing backticks — this is a proper template literal now
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #333; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>${name}</h1>
          <p>${email}</p>
        </body>
      </html>
    `);

    const pdf = await page.pdf({ format: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="resume.pdf"`);
    res.send(pdf);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  } finally {
    if (browser) await browser.close();
=======
export default async function handler(req, res) {
  try {
    const { name, email } = req.body;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(`
      <html>
        <body>
          <h1>${name}</h1>
          <p>${email}</p>
        </body>
      </html>
    `);

    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF generation failed" });
>>>>>>> 90cf117d0aa98c6d3fe56b60a795aa06c1dd3284
  }
}
