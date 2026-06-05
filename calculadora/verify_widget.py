import os
import time
from playwright.sync_api import sync_playwright

def verify_and_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=['--disable-web-security'])
        page = browser.new_page()

        # Load local HTML file
        file_path = f"file://{os.path.abspath('index.html')}"
        page.goto(file_path)

        # Wait for the widget to render
        time.sleep(2)

        # Take screenshot
        page.screenshot(path="print.png")

        print("Screenshot taken successfully and saved as print.png")
        browser.close()

if __name__ == "__main__":
    verify_and_screenshot()