import aiohttp
from pyquery import PyQuery as pq


async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()


async def scrape_yochananof(session, product_name):
    try:
        url = f'https://yochananof.co.il/s59/catalogsearch/result/?q={product_name}'
        html_content = await fetch(session, url)
        html = pq(html_content)
        price_element = html('.price:first')
        return float(price_element.text().split()[0].replace('‏', ''))
    except Exception as e:
        print(f"An error occurred on Yochananof: {e}")
        return None


async def scrape_shufersal(session, product_name):
    try:
        url = f'https://www.shufersal.co.il/online/he/search?text={product_name}'
        html_content = await fetch(session, url)
        html = pq(html_content)
        price_element = html('[data-product-price]:first')
        return float(price_element.attr('data-product-price'))
    except Exception as e:
        print(f"An error occurred on Shufersal: {e}")
        return None


async def scraper_main(product_list):
    not_found_list_yochananof = []
    not_found_list_shufersal = []
    yochananof_total_price = 0.0
    shufersal_total_price = 0.0

    async with aiohttp.ClientSession() as session:
        for product in product_list:
            print(f"Scraping {product}...")
            yochananof_price = await scrape_yochananof(session, product)
            shufersal_price = await scrape_shufersal(session, product)

            if yochananof_price is None:
                not_found_list_yochananof.append(product)
            else:
                yochananof_total_price += yochananof_price

            if shufersal_price is None:
                not_found_list_shufersal.append(product)
            else:
                shufersal_total_price += shufersal_price

    return yochananof_total_price, shufersal_total_price, not_found_list_yochananof, not_found_list_shufersal
