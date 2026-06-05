import pytest
from playwright.sync_api import Page, expect
import os

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Image Search Widget</title>
    <style>
        body, html {{
            margin: 0;
            padding: 0;
            width: 100vw;
            height: 100vh;
        }}
    </style>
</head>
<body>
    <image-search-widget></image-search-widget>
    <script type="module" src="{src}"></script>
</body>
</html>
"""

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "ignore_https_errors": True,
    }

@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    return {
        **browser_type_launch_args,
        "args": ["--disable-web-security"]
    }

@pytest.fixture
def test_html(tmp_path):
    # Testing against the final build artifact
    html_content = HTML_TEMPLATE.format(src=os.path.abspath("image-search/dist/build.js"))
    file_path = tmp_path / "test.html"
    file_path.write_text(html_content)
    return f"file://{file_path}"

def test_widget_renders_and_no_errors(page: Page, test_html: str):
    errors = []
    page.on("pageerror", lambda err: errors.append(err))
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

    page.goto(test_html)

    # Check widget exists
    widget = page.locator("image-search-widget")
    expect(widget).to_be_visible()

    # The component uses shadow DOM
    header = widget.locator("h1")
    expect(header).to_have_text("Image Search")

    # Check if images are rendered
    cards = widget.locator(".card")
    expect(cards).to_have_count(12)

    assert len(errors) == 0, f"Console errors found: {errors}"

def test_search_filtering(page: Page, test_html: str):
    page.goto(test_html)
    widget = page.locator("image-search-widget")

    search_input = widget.locator(".search-input")
    expect(search_input).to_be_visible()

    # Wait for initial render to complete
    page.wait_for_timeout(200)

    # Fill and specifically dispatch the "input" event
    search_input.fill("mountain")

    # Ensure the input event is dispatched manually if fill doesn't trigger it on shadow dom inputs reliably
    search_input.evaluate("node => node.dispatchEvent(new Event('input', { bubbles: true, composed: true }))")

    # Wait for debounce (300ms) + buffer
    page.wait_for_timeout(600)

    # The locator needs to target the cards within the component
    cards = widget.locator(".card")
    expect(cards).to_have_count(1)
    title = widget.locator(".card-title").first
    expect(title).to_have_text("Mountain Landscape")

def test_lightbox_interaction(page: Page, test_html: str):
    page.goto(test_html)
    widget = page.locator("image-search-widget")

    # Click first card
    first_card = widget.locator(".card").first
    first_card.click()

    # Lightbox should be active
    lightbox = widget.locator("#lightbox")
    expect(lightbox).to_have_class("lightbox active")

    # Lightbox image should have correct src
    lightbox_img = widget.locator("#lightbox-img")
    expect(lightbox_img).to_have_attribute("src", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200")

    # Close lightbox
    close_btn = widget.locator("#lightbox-close")
    close_btn.click()

    # Lightbox should be closed
    expect(lightbox).to_have_class("lightbox")

def test_local_storage(page: Page, test_html: str):
    page.goto(test_html)

    # Ensure domain is set for local storage context, setting a dummy value explicitly
    page.evaluate("() => localStorage.setItem('24c10110-0bb8-4585-8d71-1dd0c04e638b-last-search', 'beach')")

    # Reload page to trigger logic
    page.reload()

    widget = page.locator("image-search-widget")
    search_input = widget.locator(".search-input")

    # Wait for component logic to fire
    page.wait_for_timeout(200)

    # Check if value persisted and was read
    expect(search_input).to_have_value("beach")

    # Check if grid is filtered automatically
    cards = widget.locator(".card")
    expect(cards).to_have_count(1)
