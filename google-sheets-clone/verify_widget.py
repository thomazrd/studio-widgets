import pytest
from playwright.sync_api import sync_playwright

def test_widget_functionality():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=['--disable-web-security'])
        page = browser.new_page()

        # Catch console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        # Read the built dist
        with open('dist/build.js', 'r') as f:
            script_content = f.read()

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body, html {{ margin: 0; padding: 0; height: 100vh; width: 100vw; }}
            </style>
        </head>
        <body>
            <google-sheets-clone></google-sheets-clone>
            <script>{script_content}</script>
        </body>
        </html>
        """

        import tempfile
        import os

        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as f:
            f.write(html_content)
            temp_path = f.name

        page.goto(f"file://{os.path.abspath(temp_path)}")

        # Wait for component to load
        widget = page.locator('google-sheets-clone')
        widget.wait_for()

        # Get shadow root
        shadow = page.locator('google-sheets-clone >> css=*').first

        # Test A1 input
        td_a1 = widget.locator('td[data-id="A1"]')
        td_a1.wait_for()

        # Click to select, double click to edit
        td_a1.dblclick()
        td_a1.evaluate("el => el.textContent = '10'")
        td_a1.press("Enter")

        # Test A2 formula
        td_a2 = widget.locator('td[data-id="A2"]')
        td_a2.dblclick()
        # Since it's contenteditable, playwright's fill doesn't always trigger input nicely on shadow dom. Let's try typing it
        td_a2.evaluate("el => el.textContent = '=A1+5'")
        # Fire blur event instead of enter so we ensure it fires our onblur logic perfectly without focus/blur race conditions
        td_a2.evaluate("el => el.blur()")

        page.wait_for_timeout(100)

        # Test evaluation
        # A2 should now evaluate to 15
        assert td_a2.text_content() == "15", f"Expected 15, got {td_a2.text_content()}"

        # Update A1, should update A2 via naive loop (if implemented right) or manual re-calc
        td_a1.dblclick()
        td_a1.evaluate("el => el.textContent = '20'")
        td_a1.press("Enter")

        # Wait for the re-eval
        page.wait_for_timeout(500)
        assert td_a2.text_content() == "25", f"Expected 25, got {td_a2.text_content()}"

        # Check formatting
        btn_bold = widget.locator('#btn-bold')
        td_a1.click()
        btn_bold.click()

        # Checking computed style of a shadow DOM element requires JS eval
        is_bold = td_a1.evaluate("el => window.getComputedStyle(el).fontWeight === '700' || window.getComputedStyle(el).fontWeight === 'bold'")
        assert is_bold, "Cell should be bold"

        # Give it a second to render nicely
        page.wait_for_timeout(500)

        # Take screenshot
        page.screenshot(path="print.png")

        assert not console_errors, f"Found console errors: {console_errors}"
        print("All tests passed! Screenshot saved as print.png")
        browser.close()

if __name__ == "__main__":
    test_widget_functionality()
