import os
import pytest
from playwright.sync_api import sync_playwright

WIDGET_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(WIDGET_DIR, 'dist')
BUILD_JS = os.path.join(DIST_DIR, 'build.js')

@pytest.fixture(scope="session")
def browser_context():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--disable-web-security"])
        context = browser.new_context()
        yield context
        browser.close()

@pytest.fixture
def page(browser_context):
    page = browser_context.new_page()
    yield page
    page.close()

def load_widget(page):
    with open(BUILD_JS, 'r') as f:
        js_content = f.read()

    # We need to serve from a file URL instead of set_content directly to avoid
    # localStorage "Access is denied for this document" error in Playwright with data URLs
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body, html {{ margin: 0; padding: 0; width: 100vw; height: 100vh; }}
        </style>
    </head>
    <body>
        <macos-notes></macos-notes>
        <script>
            {js_content}
        </script>
    </body>
    </html>
    """
    import tempfile

    # Write to a temporary file and load it via file:// protocol
    temp_fd, temp_path = tempfile.mkstemp(suffix='.html')
    with os.fdopen(temp_fd, 'w') as f:
        f.write(html_content)

    page.goto(f"file://{temp_path}")
    page.wait_for_selector('macos-notes')

def test_widget_renders_without_errors(page):
    errors = []
    page.on("pageerror", lambda err: errors.append(err))
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

    load_widget(page)

    # Check if component is in DOM and shadow root exists
    widget = page.locator('macos-notes')
    assert widget.count() == 1

    # Give a bit of time for dynamic icons
    page.wait_for_timeout(500)

    assert len(errors) == 0, f"Console errors found: {errors}"

def test_create_and_edit_note(page):
    load_widget(page)

    # Helper to execute query in shadow DOM
    def query_shadow(selector):
        return page.evaluate_handle(f"document.querySelector('macos-notes').shadowRoot.querySelector('{selector}')")

    # Check new note button
    new_btn = query_shadow('#new-note-btn')
    new_btn.click()

    # Wait for the UI to update
    page.wait_for_timeout(200)

    # Check editor
    editor = query_shadow('.editor-area')

    # Focus and type
    editor.evaluate("el => el.focus()")
    page.keyboard.type("My Awesome Note\nThis is a test.")

    # Wait for debounce save (500ms)
    page.wait_for_timeout(1000)

    # Check notes list
    note_items = page.evaluate("document.querySelector('macos-notes').shadowRoot.querySelectorAll('.note-item').length")
    assert note_items >= 1

    # Verify title in list
    first_title = page.evaluate("document.querySelector('macos-notes').shadowRoot.querySelector('.note-item-title').textContent")
    assert "My Awesome Note" in first_title

def test_search_notes(page):
    load_widget(page)

    # Get shadow queries
    def query_shadow(selector):
        return page.evaluate_handle(f"document.querySelector('macos-notes').shadowRoot.querySelector('{selector}')")

    # Clear local storage first via evaluate
    page.evaluate("localStorage.clear();")
    # Reload widget to apply empty storage
    load_widget(page)

    # Create two notes
    new_btn = query_shadow('#new-note-btn')

    new_btn.click()
    page.wait_for_timeout(100)
    editor = query_shadow('.editor-area')
    editor.evaluate("el => el.focus()")
    page.keyboard.type("Apple Note\nContent A")
    page.wait_for_timeout(600)

    new_btn = query_shadow('#new-note-btn')
    new_btn.click()
    page.wait_for_timeout(100)
    editor = query_shadow('.editor-area')
    editor.evaluate("el => el.focus()")
    page.keyboard.type("Banana Note\nContent B")
    page.wait_for_timeout(600)

    # Total notes should be 2
    count_all = page.evaluate("document.querySelector('macos-notes').shadowRoot.querySelectorAll('.note-item').length")
    assert count_all == 2

    # Search for "Apple"
    search_input = query_shadow('.search-input')
    search_input.evaluate("el => el.focus()")
    page.keyboard.type("apple")

    page.wait_for_timeout(200)

    # Filtered notes should be 1
    count_filtered = page.evaluate("document.querySelector('macos-notes').shadowRoot.querySelectorAll('.note-item').length")
    assert count_filtered == 1

    title = page.evaluate("document.querySelector('macos-notes').shadowRoot.querySelector('.note-item-title').textContent")
    assert "Apple Note" in title
