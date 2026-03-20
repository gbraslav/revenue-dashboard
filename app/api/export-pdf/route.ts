import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";

export const maxDuration = 60;

async function getLaunchOptions() {
  if (process.env.NODE_ENV === "development") {
    const { chromium } = await import("@playwright/test");
    return {
      executablePath: chromium.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
  }
  const chromium = (await import("@sparticuz/chromium")).default;
  return {
    executablePath: await chromium.executablePath(),
    args: chromium.args,
  };
}

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const reportUrl = `${protocol}://${host}/report/pdf`;

  let browser;
  try {
    const launchOptions = await getLaunchOptions();
    browser = await puppeteer.launch({ ...launchOptions, headless: true });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900 });
    await page.goto(reportUrl, { waitUntil: "networkidle0", timeout: 30000 });

    // Ensure light mode for the PDF
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
    });

    // Wait for Recharts SVGs to be rendered
    await page.waitForSelector(".recharts-surface", { timeout: 15000 });

    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="executive-dashboard-report.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return Response.json({ error: "Failed to generate PDF" }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
