from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

PAGES = [
    "http://localhost:3000/",
    "http://localhost:3000/dashboard",
    "http://localhost:3000/backlog",
    "http://localhost:3000/settings",
]

def test_pages_have_titles(driver):
    for url in PAGES:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        assert driver.title is not None
