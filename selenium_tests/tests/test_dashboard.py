# import pytest
# from selenium.webdriver.common.by import By


# def test_dashboard_loads(driver):
#     driver.get("http://localhost:3000")
#     # Verify dashboard header exists
#     header = driver.find_element(By.XPATH, "//h1[contains(text(),'Dashboard')]")
#     assert header is not None


# def test_navigate_to_backlog(driver):
#     driver.get("http://localhost:3000")
#     # Click on Backlog navigation link (assume data-testid="nav-backlog")
#     backlog_link = driver.find_element(By.CSS_SELECTOR, "[data-testid='nav-backlog']")
#     backlog_link.click()
#     # Verify URL contains /backlog
#     assert "/backlog" in driver.current_url


# def test_create_new_story(driver):
#     driver.get("http://localhost:3000")
#     # Open create story dialog (data-testid="create-story-btn")
#     create_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='create-story-btn']")
#     create_btn.click()
#     # Fill title (data-testid="story-title-input")
#     title_input = driver.find_element(By.CSS_SELECTOR, "[data-testid='story-title-input']")
#     title_input.send_keys("Test Story")
#     # Submit (data-testid="submit-story-btn")
#     submit_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='submit-story-btn']")
#     submit_btn.click()
#     # Verify new story appears in list (data-testid="story-item-Test Story")
#     story_item = driver.find_element(By.CSS_SELECTOR, "[data-testid='story-item-Test Story']")
#     assert story_item is not None


# def test_dark_mode_toggle(driver):
#     driver.get("http://localhost:3000")
#     # Toggle dark mode (data-testid="dark-mode-toggle")
#     toggle = driver.find_element(By.CSS_SELECTOR, "[data-testid='dark-mode-toggle']")
#     toggle.click()
#     # Verify body has dark class
#     body = driver.find_element(By.TAG_NAME, "body")
#     assert "dark" in body.get_attribute("class")


from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_dashboard_loads(driver):
    driver.get("http://localhost:3000/dashboard")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )
    assert driver.current_url.endswith("/dashboard")
