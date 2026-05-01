import puppeteer from "puppeteer";

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
  }
}
