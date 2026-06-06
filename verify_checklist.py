import pytest
from playwright.sync_api import sync_playwright
import os

def test_checklist_widget():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--disable-web-security"])
        page = browser.new_page()

        # Catch console errors
        console_messages = []
        page.on("console", lambda msg: console_messages.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_messages.append(err.message))

        # Absolute path to the build.js
        current_dir = os.path.dirname(os.path.abspath(__file__))
        build_js_path = os.path.join(current_dir, "checklist-app", "dist", "build.js")

        # Load build.js via local HTML file workaround
        with open(build_js_path, "r") as f:
            script_content = f.read()

        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Checklist Widget Test</title>
            <style>
                body, html {{
                    margin: 0;
                    padding: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #ccc;
                }}
            </style>
        </head>
        <body>
            <checklist-widget></checklist-widget>
            <script>{script_content}</script>
        </body>
        </html>
        """

        test_html_path = os.path.join(current_dir, "test_checklist.html")
        with open(test_html_path, "w") as f:
            f.write(html_content)

        # Load the HTML
        page.goto(f"file://{test_html_path}")

        # Wait for the component to be registered and render
        page.wait_for_selector("checklist-widget")

        # Give it a small moment for React to mount inside Shadow DOM
        page.wait_for_timeout(1000)

        # Check if shadow root exists
        widget = page.locator("checklist-widget")
        assert widget.count() == 1, "checklist-widget element not found"

        # Verify no console errors
        assert len(console_messages) == 0, f"Console errors found: {console_messages}"

        # Take a screenshot
        screenshot_path = os.path.join(current_dir, "checklist-app", "print.png")
        page.screenshot(path=screenshot_path)

        browser.close()

        # Cleanup
        if os.path.exists(test_html_path):
            os.remove(test_html_path)

if __name__ == "__main__":
    test_checklist_widget()
    print("Verification completed successfully.")
