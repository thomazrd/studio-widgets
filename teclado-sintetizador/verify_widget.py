from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(1000)

    # The widget is in shadow DOM, so we use locators to find it
    # We want to change the octave and instrument, and press a few keys

    # Locate the host element
    widget = page.locator("teclado-sintetizador")

    # Interact with controls inside shadow DOM (Playwright pierces shadow dom transparently in locators if using modern css selectors or standard text/role locators if the component supports it)
    # Actually, Playwright pierces open shadow roots automatically.

    # Change octaves to 3
    page.locator("#octave-select").select_option("3")
    page.wait_for_timeout(500)

    # Change instrument to organ
    page.locator("#instrument-select").select_option("organ")
    page.wait_for_timeout(500)

    # Force click because black keys might partially overlay white keys

    # Click middle C (C4)
    c4_key = page.locator(".key[data-note='C4']")
    c4_key.click(force=True)
    page.wait_for_timeout(500)

    # Click E4
    e4_key = page.locator(".key[data-note='E4']")
    e4_key.click(force=True)
    page.wait_for_timeout(500)

    # Click G4
    g4_key = page.locator(".key[data-note='G4']")
    g4_key.click(force=True)
    page.wait_for_timeout(500)

    # Click a black key too
    g4_sharp_key = page.locator(".key[data-note='G#4']")
    g4_sharp_key.click(force=True)
    page.wait_for_timeout(500)

    # Take a screenshot to show the final 3-octave layout
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
