import aiohttp
from pyquery import PyQuery as pq
from fuzzywuzzy import process


async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()


async def scrape_yochananof(session, product_name):
    try:
        url = f'https://yochananof.co.il/s59/catalogsearch/result/?q={product_name}'
        html_content = await fetch(session, url)
        html = pq(html_content)

        # # Write the HTML content to a file
        # with open('yochananof.html', 'w') as f:
        #     f.write(html_content)

        # get the first 5 products
        product_elements = html('.product-item')[:5]
        products = []
        for element in product_elements:
            element = pq(element)
            name = element('.product-item-link').text()[::-1]
            price = float(element('.price').text().split()[0].replace('‏', ''))
            products.append({'name': name, 'price': price})

        # Find the product that most closely matches the search query
        names = [product['name'] for product in products]

        best_match = process.extractOne(product_name[::-1], names)

        # Return the best-matching product
        for product in products:
            if product['name'] == best_match[0]:
                return product

        return None

    except Exception as e:
        print(f"An error occurred on Yochananof: {e}")
        return None


async def scrape_shufersal(session, product_name):
    try:
        url = f'https://www.shufersal.co.il/online/he/search?text={product_name}'
        html_content = await fetch(session, url)
        html = pq(html_content)

        # # Write the HTML content to a file
        # with open('shufersal.html', 'w') as f:
        #     f.write(html_content)

        # get the first 5 products
        product_elements = html('.tileBlock')[:5]
        products = []
        for element in product_elements:
            element = pq(element)
            name = element.attr('data-product-name')
            price = float(element.attr('data-product-price'))
            products.append({'name': name[::-1], 'price': price})

        # Find the product that most closely matches the search query
        names = [product['name'] for product in products]
        best_match = process.extractOne(product_name[::-1], names)

        # Return the best-matching product
        for product in products:
            if product['name'] == best_match[0]:
                return product
        print("No product found")
        return None
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
            print(f"Scraping {product[::-1]}...")
            yochananof_product = await scrape_yochananof(session, product)
            shufersal_product = await scrape_shufersal(session, product)

            # If no matching products were found, add the product to the not found list
            if not yochananof_product:
                not_found_list_yochananof.append(product)
            else:
                yochananof_total_price += yochananof_product['price']

            if not shufersal_product:
                not_found_list_shufersal.append(product)
            else:
                shufersal_total_price += shufersal_product['price']

    return yochananof_total_price, shufersal_total_price, not_found_list_yochananof, not_found_list_shufersal
