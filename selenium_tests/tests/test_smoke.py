def test_app_is_running(driver):
    driver.get("http://localhost:3000")
    assert driver.title != ""
