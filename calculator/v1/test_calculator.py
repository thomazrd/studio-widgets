import os
import pytest
from playwright.sync_api import sync_playwright

HTML_CONTENT = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator Widget Test</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #e5e7eb;
        }
        .widget-container {
            width: 320px;
            height: 500px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="widget-container">
        <calculator-widget></calculator-widget>
    </div>
    <script type="module" src="./dist/index.js"></script>
</body>
</html>
"""

def setup_test_file():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(base_dir, 'test.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(HTML_CONTENT)
    return f"file://{html_path}"

def test_calculator_widget():
    html_url = setup_test_file()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--disable-web-security'])
        context = browser.new_context(viewport={'width': 800, 'height': 600})
        page = context.new_page()
        page.goto(html_url)

        # Wait for the component to load
        page.wait_for_selector('calculator-widget', state='attached')
        widget = page.locator('calculator-widget')

        # Check standard layout
        display = widget.locator('#display')
        assert display.text_content().strip() == '0', "Initial display should be 0"

        # Helper to click a button in shadow dom
        def click_btn(val):
            widget.locator(f'.btn[data-val="{val}"]').locator('visible=true').first.click()

        # Test Standard Operations (2 + 3 = 5)
        click_btn('2')
        click_btn('+')
        click_btn('3')
        click_btn('=')
        assert display.text_content().strip() == '5', "2 + 3 should be 5"

        # Test Keyboard input
        page.keyboard.press('Escape') # Maps to C
        assert display.text_content().strip() == '0', "Escape should clear to 0"

        page.keyboard.press('8')
        page.keyboard.press('*')
        page.keyboard.press('9')
        page.keyboard.press('Enter')
        assert display.text_content().strip() == '72', "8 * 9 should be 72"

        # Test Division by Zero
        page.keyboard.press('Escape')
        page.keyboard.press('5')
        page.keyboard.press('/')
        page.keyboard.press('0')
        page.keyboard.press('Enter')
        assert display.text_content().strip() == 'Erro', "Division by zero should show 'Erro'"
        assert "error" in display.get_attribute('class'), "Error class should be applied"

        # Test Standard Mode Toggle
        click_btn('C')
        widget.locator('.mode-btn[data-mode="scientific"]').click()

        # Take a screenshot for the widget
        widget_container = page.locator('.widget-container')
        base_dir = os.path.dirname(os.path.abspath(__file__))
        screenshot_path = os.path.join(base_dir, 'print.png')
        widget_container.screenshot(path=screenshot_path)
        assert os.path.exists(screenshot_path), "Screenshot print.png should have been created"

        # Test Scientific Functions
        click_btn('9')
        click_btn('sqrt')
        assert display.text_content().strip() == '3', "sqrt(9) should be 3"

        click_btn('C')
        # Test Parentheses ( 2 + 3 ) * 4
        click_btn('(')
        click_btn('2')
        click_btn('+')
        click_btn('3')
        click_btn(')')
        click_btn('*')
        click_btn('4')
        click_btn('=')
        assert display.text_content().strip() == '20', "(2+3)*4 should be 20"

        # Test powers 2 ^ 3
        click_btn('C')
        click_btn('2')
        click_btn('^')
        click_btn('3')
        click_btn('=')
        assert display.text_content().strip() == '8', "2^3 should be 8"

        # Test % operation
        click_btn('C')
        click_btn('5')
        click_btn('0')
        click_btn('%')
        assert display.text_content().strip() == '0,5', "50% should be 0.5"

        # Ensure errors on math domains
        click_btn('C')
        click_btn('1')
        click_btn('+/-')
        click_btn('sqrt')
        assert display.text_content().strip() == 'Erro', "sqrt(-1) should error"

        browser.close()

if __name__ == '__main__':
    test_calculator_widget()
    print("All tests passed successfully!")
