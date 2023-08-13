import json
import aiohttp
from pyquery import PyQuery as pq
from fuzzywuzzy import process
from urllib.parse import quote


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

        # get the first 10 products
        product_elements = html('.product-item')[:10]
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
                return {'name': product['name'][::-1], 'price': product['price']}

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

        # get the first 10 products
        product_elements = html('.tileBlock')[1:11]
        products = []
        for element in product_elements:
            element = pq(element)
            name = element.attr('data-product-name')
            price = float(element.attr('data-product-price'))
            products.append({'name': name[::-1], 'price': price})

        # Find the product that most closely matches the search query
        names = [product['name'] for product in products]
        best_match = process.extractBests(product_name[::-1], names)

        # Return the best-matching product
        for product in products:
            if product['name'] == best_match[0][0]:
                return {'name': product['name'][::-1], 'price': product['price']}
        print("No product found")
        return None
    except Exception as e:
        print(f"An error occurred on Shufersal: {e}")
        return None


def get_headers_for_product(product_name):
    encoded_product_name = quote(product_name)
    return {

        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
        'Authorization': 'undefined',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'https://www.carrefour.co.il',
        'Referer': f'https://www.carrefour.co.il/search-result/{encoded_product_name}?q={encoded_product_name}',
        'Sec-Ch-Ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
    }


def create_payload(product_name):
    encoded_product_name = quote(product_name)
    payload = {
        "header": {
            "version": "4.0.3", "av": "1.0", "lang": "he", "platform": "web",
            "client": "web", "os": "mac os 10.15.7",
            "browser": "chrome 113",
            "brandId": "carrefour"
        },
        "payload": {
            "value": product_name, "skip": 0, "limit": 50, "filter": "",
            "update": True, "source": "search results page",
            "sourcePageUrl": f"https://www.carrefour.co.il/search-result/{encoded_product_name}?q={encoded_product_name}",
            "currentPageUrl": f"https://www.carrefour.co.il/search-result/{encoded_product_name}?q={encoded_product_name}",
            "clubTokens": []
        }
    }
    return payload


async def scrape_carrefour(session, product_name):
    try:
        url = 'https://www.carrefour.co.il/api/product/search'
        payload = create_payload(product_name)
        headers = get_headers_for_product(product_name)
        async with session.post(url, headers=headers, json=payload) as response:
            response_json = await response.json()
            # # Write the JSON response to a file
            # with open('carrefour.json', 'w', encoding='utf-8') as f:
            #     json.dump(response_json, f, ensure_ascii=False, indent=4)

            # Get the list of products from the response JSON
            products = response_json['data']

            # Get the first 5 product names
            product_names = [product['name'][::-1]
                             for product in products[:10]]

            # Get the first 5 product prices
            product_prices = [float(product['price'])
                              for product in products[:10]]
            products = [{'name': name, 'price': price} for name, price
                        in zip(product_names, product_prices)]
            # Find the product that most closely matches the search query
            best_match = process.extractOne(product_name[::-1], product_names)
            # Return the best-matching product
            for product in products:
                if product['name'] == best_match[0]:
                    return {'name': product['name'][::-1], 'price': product['price']}
            return None
    except Exception as e:
        print(f"An error occurred on Carrefour: {e}")
        return None


async def scraper_main(product_list):
    not_found_list_yochananof = []
    not_found_list_shufersal = []
    not_found_list_carrefour = []
    yochananof_total_price = 0.0
    shufersal_total_price = 0.0
    carrefour_total_price = 0.0
    yochananof_found = []
    shufersal_found = []
    carrefour_found = []

    async with aiohttp.ClientSession() as session:
        for product in product_list:
            # print(f"Scraping {product[::-1]}...")
            yochananof_product = await scrape_yochananof(session, product)
            shufersal_product = await scrape_shufersal(session, product)
            carrefour_product = await scrape_carrefour(session, product)

            # If no matching products were found, add the product to the not found list
            if not yochananof_product:
                not_found_list_yochananof.append(product)
                yochananof_found.append(
                    {'name': product, "price": "N/A"})
            else:
                yochananof_found.append(yochananof_product)
                yochananof_total_price += yochananof_product['price']

            if not shufersal_product:
                shufersal_found.append(
                    {'name': product, "price": "N/A"})
                not_found_list_shufersal.append(product)
            else:
                shufersal_found.append(shufersal_product)
                shufersal_total_price += shufersal_product['price']

            if not carrefour_product:
                carrefour_found.append(
                    {'name': product, "price": "N/A"})
                not_found_list_carrefour.append(product)
            else:
                carrefour_found.append(carrefour_product)
                carrefour_total_price += carrefour_product['price']

    # for product in yochananof_found:
    #     # print(product)

    return yochananof_total_price, shufersal_total_price, carrefour_total_price, not_found_list_yochananof,\
        not_found_list_shufersal, not_found_list_carrefour, yochananof_found, shufersal_found, carrefour_found
