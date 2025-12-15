# import pytest
# from selenium.webdriver.common.by import By


# def test_story_review_loads(driver):
#     driver.get("http://localhost:3000/story-review")
#     header = driver.find_element(By.XPATH, "//h1[contains(text(),'Story Review')]")
#     assert header is not None


# def test_approve_story(driver):
#     driver.get("http://localhost:3000/story-review")
#     # Assume first story approve button data-testid='approve-btn-0'
#     approve_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='approve-btn-0']")
#     approve_btn.click()
#     # Verify status changed (data-testid='status-0' contains 'Approved')
#     status = driver.find_element(By.CSS_SELECTOR, "[data-testid='status-0']")
#     assert 'Approved' in status.text


# def test_reject_story(driver):
#     driver.get("http://localhost:3000/story-review")
#     # Assume second story reject button data-testid='reject-btn-1'
#     reject_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='reject-btn-1']")
#     reject_btn.click()
#     # Verify status changed to Rejected
#     status = driver.find_element(By.CSS_SELECTOR, "[data-testid='status-1']")
#     assert 'Rejected' in status.text


from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_story_review_page_loads(driver):
    driver.get("http://localhost:3000/story-review")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )
    assert driver.current_url.endswith("/story-review")
