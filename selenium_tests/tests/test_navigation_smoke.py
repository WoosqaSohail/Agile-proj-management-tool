from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_user_can_navigate_multiple_pages(driver):
    urls = [
        "http://localhost:3000/",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/backlog",
    ]

    for url in urls:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        assert driver.current_url == url
