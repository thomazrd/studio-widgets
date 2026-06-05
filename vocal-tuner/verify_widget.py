import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'])
        page = await browser.new_page()

        # Navigate to the local server
        await page.goto("http://localhost:3000")

        # Give it a second to render
        await asyncio.sleep(1)

        # The elements are inside the shadow dom.
        # Using locator directly on the component pierces open shadow DOMs natively.

        tuner_btn = page.locator("vocal-tuner").locator("#mic-btn")
        await tuner_btn.click()

        await asyncio.sleep(2)

        instrument_select = page.locator("vocal-tuner").locator("#instrument-select")
        await instrument_select.select_option("synthesizer")

        # Taking a screenshot
        await page.screenshot(path="vocal-tuner/v1.0.0/print.png")

        print("Captured screenshot at vocal-tuner/v1.0.0/print.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
