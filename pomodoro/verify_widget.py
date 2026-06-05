import os
import time
from playwright.sync_api import sync_playwright

def verify_and_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=['--disable-web-security'])
        page = browser.new_page()

        # Load local HTML file
        # Playwright does not execute type="module" from file:// by default without jumping through hoops
        # Let's write a quick inline version pointing to the built IIFE
        test_html = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100vw;
              height: 100vh;
              background-color: #f0f0f5;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            #widget-container {
              width: 400px;
              height: 600px;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
          </style>
        </head>
        <body>
          <div id="widget-container">
            <pomodoro-app></pomodoro-app>
          </div>
          <script src="./dist/build.js"></script>
        </body>
        </html>
        """
        with open('test_build.html', 'w') as f:
            f.write(test_html)

        file_path = f"file://{os.path.abspath('test_build.html')}"
        page.goto(file_path)

        # Wait for the widget to render
        time.sleep(3)

        # Take screenshot
        page.screenshot(path="print.png")

        print("Screenshot taken successfully and saved as print.png")
        browser.close()

if __name__ == "__main__":
    verify_and_screenshot()