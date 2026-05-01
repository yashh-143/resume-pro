import puppeteer from "puppeteer";

export default async function handler(req,res){
  const {name,email} = req.body;

  const browser = await puppeteer.launch({
    args:["--no-sandbox"]
  });

  const page = await browser.newPage();

  await page.setContent(
    <h1>${name}</h1>
    <p>${email}</p>
  );

  const pdf = await page.pdf({format:"A4"});

  await browser.close();

  res.setHeader("Content-Type","application/pdf");
  res.send(pdf);
}