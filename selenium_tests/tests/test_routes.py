import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:3000"

ROUTES = [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/backlog",
    "/settings",
    "/story-review",
]

@pytest.mark.parametrize("route", ROUTES)
def test_routes_are_accessible(driver, route):
    driver.get(f"{BASE_URL}{route}")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )
    assert driver.current_url.startswith(BASE_URL)
