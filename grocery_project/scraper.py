from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Setup Chrome options to run headless
chrome_options = Options()
chrome_options.add_argument("--headless")

# create a new browser session
driver = webdriver.Chrome(options=chrome_options)

# navigate to a webpage
driver.get('https://yochananof.co.il/')

# find the search input field
search_field = driver.find_element(By.ID, 'autocomplete-0-input')
print(search_field.text)

# clear the input field
search_field.clear()

# enter the search keyword and submit
search_field.send_keys('מלפפון')
search_field.send_keys(Keys.RETURN)

# allow some time for results to load
time.sleep(5)

# find the price of the first product in the search result
price_element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '.price:first-of-type'))
)

# print the price
print(price_element.text)

# end the browser session
driver.quit()
