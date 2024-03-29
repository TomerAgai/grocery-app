# Grocery App

The Grocery App is a web application designed to optimize your grocery shopping experience. This tool allows users to create and manage grocery lists, compare prices between different stores, and make informed purchasing decisions. It's built with Django, MySQL, and React-Ionic. 

## Features

- **User Authentication:** Users can create an account, log in, and log out, ensuring secure access to their grocery lists.
- **Grocery List Management:** Users can create, share, and manage grocery lists. They can add or delete items from the lists. If a user deletes a list they did not create, it will only be deleted for them.
- **Price Comparison:** The application integrates with various grocery stores' APIs (Yochananof, Shufersal, Carrefour) and fetches real-time prices, allowing users to compare prices for items in their grocery lists and find the best deals.
- **User-Friendly Interface:** The application provides a clean and intuitive interface built with React-Ionic for a seamless user experience.

## Technologies Used

- **Django:** A high-level Python web framework used for rapid development and clean design.
- **MySQL:** An open-source relational database management system.
- **React-Ionic:** A powerful UI framework that combines React's flexibility with Ionic's adaptability for building cross-platform applications.
- **HTML, CSS, JavaScript:** The core web technologies used for building the user interface.
- **Django REST Framework:** A powerful toolkit for building Web APIs using Django.
- **Django ORM:** An object-relational mapping (ORM) tool used to interact with the database.
- **JWT (JSON Web Tokens):** A standard for securely transmitting information between parties as a JSON object.

## Getting Started

To run the Grocery App locally, follow these steps:

1. Clone the repository: `git clone https://github.com/TomerAgai/grocery-app`.
2. Navigate into the backend directory: `cd grocery-app/grocery_project`.
3. Install the necessary backend dependencies: `pip install -r requirements.txt`.
4. Configure the database connection settings in the Django settings file (see [Database Configuration](#database-configuration) section).
5. Run the database migrations: `python manage.py migrate`.
6. Start the Django development server: `python manage.py runserver`.
7. In a new terminal window, navigate into the frontend directory: `cd ../grocery-frontend`.
8. Install the necessary frontend dependencies: `npm install`.
9. Start the React-Ionic development server: `ionic serve`.
10. Open your browser and go to `localhost:8100` (or the specified port where your React app is running).

### Database Configuration

To configure the MySQL database connection, follow the instructions specific to your operating system:

#### macOS

1. Install MySQL:
   `brew install mysql`
2. Start the MySQL service:
    `brew services start mysql`
3. Open the MySQL shell:
    `mysql -u root -p`
4. Create the database:
    `CREATE DATABASE grocery_db;`

#### Windows
1. Download MySQL Installer from the official website.
2. Run the installer and follow the on-screen instructions.
3. Open the MySQL Command Line Client from the Start Menu.
4. Log in with your root password.
5. Create the database:
    `CREATE DATABASE grocery_db;`

#### Linux (Ubuntu)

1. Open a terminal.
2. Update the package database:
    `sudo apt-get update`
3. Install MySQL:
    `sudo apt-get install mysql-server`
4. Secure the installation (optional, but recommended):
    `sudo mysql_secure_installation`
5. Open the MySQL shell:
    `mysql -u root -p`
6. Create the database:
    `CREATE DATABASE grocery_db;`


These instructions cover the installation of MySQL and the creation of the grocery_db database. Configure the Django settings file with the appropriate database connection details.



## Deployment

To deploy your application on a server (like an AWS EC2 instance), follow these general steps:

1. Transfer your Django and Ionic-React project files to your server.
2. For Django, install dependencies, configure your database, run migrations, and start the Django application.
3. For Ionic-React, install dependencies, then build your project for production with `ionic build`.
4. Configure your web server (like Nginx or Apache) to serve the Django application and the static files generated by `ionic build`.

Remember, when deploying to a production environment, be sure to update your application's configuration as necessary (like changing API endpoint URLs from `localhost` to your server's URL).

## Contributing

Contributions to the Grocery App are not currently accepted as it is a private project. However, if you encounter any bugs or have suggestions, feel free to open an issue or submit a pull request.

## License

The Grocery App is proprietary software. All rights reserved. Unauthorized use, modification, or distribution is strictly prohibited.

