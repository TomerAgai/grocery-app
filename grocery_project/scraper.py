import aiohttp
from pyquery import PyQuery as pq
import asyncio


async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

# async def fetch(session, url, filename):
#     async with session.get(url) as response:
#         html_content = await response.text()
#         with open(filename, 'w', encoding='utf-8') as f:
#             f.write(html_content)
#         return html_content


async def scrape_yochananof(session, product_name):
    try:
        url = f'https://yochananof.co.il/s59/catalogsearch/result/?q={product_name}'
        # html_content = await fetch(session, url, 'yochananof_search.html')
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


async def main():
    async with aiohttp.ClientSession() as session:
        product_list = ['חלב', 'ביצים']  # Your list of products in Hebrew
        for product in product_list:
            yochananof_price = await scrape_yochananof(session, product)
            shufersal_price = await scrape_shufersal(session, product)
            print(
                f"For {product}, Yochananof price: {yochananof_price},  Shufersal price: {shufersal_price}")

asyncio.run(main())
