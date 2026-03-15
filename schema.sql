-- ============================================
-- Maison E-Commerce Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(500),
    stock INT DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    address TEXT NOT NULL,
    status ENUM('pending','processing','shipped','delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- Sample Products
-- ============================================
INSERT INTO products (name, description, price, image, stock, category) VALUES
('Linen Throw Pillow', 'Hand-stitched linen pillow with a natural, earthy texture. Perfect for layering on sofas and beds.', 38.00, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', 45, 'Home'),
('Ceramic Pour-Over Set', 'Minimalist hand-thrown ceramic pour-over coffee set. Each piece is unique with subtle glaze variations.', 72.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', 30, 'Kitchen'),
('Beeswax Pillar Candle', 'Pure beeswax pillar candles with a warm honey scent. Burns cleanly for 40+ hours.', 24.00, 'https://images.unsplash.com/photo-1603905756167-4f6e5df4c4c3?w=600', 60, 'Home'),
('Woven Market Basket', 'Handwoven seagrass basket with leather handles. Ideal for storage or as a farmers market companion.', 55.00, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', 25, 'Accessories'),
('Merino Wool Blanket', 'Ethically sourced merino wool throw in a classic herringbone weave. Naturally temperature-regulating.', 145.00, 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600', 20, 'Home'),
('Oak Wood Tray', 'Solid white oak serving tray with a food-safe oil finish. Sustainably harvested.', 62.00, 'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=600', 35, 'Kitchen'),
('Linen Apron', 'Stone-washed linen apron with adjustable neck strap and deep front pockets.', 48.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 40, 'Kitchen'),
('Terracotta Planter', 'Hand-thrown terracotta planter with drainage hole. Naturally porous for healthy root growth.', 32.00, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600', 50, 'Garden'),
('Linen Duvet Cover', 'Stonewashed linen duvet cover that gets softer with every wash.', 188.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600', 15, 'Bedroom'),
('Walnut Cheese Board', 'End-grain walnut cheese board with juice groove. A lifetime piece for entertaining.', 95.00, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600', 22, 'Kitchen'),
('Rattan Wall Mirror', 'Natural rattan-framed circular mirror. Adds warmth and texture to any wall.', 78.00, 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600', 18, 'Home'),
('Cotton Waffle Towel', 'Pre-washed cotton waffle weave towel. Quick-drying and ultra-absorbent.', 35.00, 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600', 55, 'Bathroom');
