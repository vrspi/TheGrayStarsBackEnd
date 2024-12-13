-- Create homepage table
CREATE TABLE IF NOT EXISTS homepage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create hero section table
CREATE TABLE IF NOT EXISTS hero_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    homepage_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    background_image VARCHAR(1024),
    FOREIGN KEY (homepage_id) REFERENCES homepage(id)
);

-- Create about section table
CREATE TABLE IF NOT EXISTS about_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    homepage_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image VARCHAR(1024),
    FOREIGN KEY (homepage_id) REFERENCES homepage(id)
);

-- Create featured products table
CREATE TABLE IF NOT EXISTS featured_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    homepage_id INT NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    display_order INT NOT NULL,
    FOREIGN KEY (homepage_id) REFERENCES homepage(id)
);

-- Insert default homepage data
INSERT INTO homepage (id) VALUES (1);

INSERT INTO hero_section (homepage_id, title, subtitle, background_image)
VALUES (1, 'Welcome to TheGrayStars', 'Discover amazing content', '');

INSERT INTO about_section (homepage_id, title, content, image)
VALUES (1, 'About Us', 'Welcome to TheGrayStars', '');
