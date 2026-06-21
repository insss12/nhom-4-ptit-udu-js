-- ============================================================
-- product_data.sql
-- Drops and recreates the product_data table, then seeds it
-- with the provided sample product rows.
-- ============================================================

DROP TABLE IF EXISTS product_data;

CREATE TABLE product_data (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    rating TINYINT(1) NOT NULL DEFAULT 0,
    is_sale TINYINT(1) NOT NULL DEFAULT 0,
    image_url VARCHAR(500) NOT NULL,
    old_price DECIMAL(10, 2) NULL,
    new_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    CHECK (old_price > 0),
    CHECK (new_price > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO product_data (name, rating, is_sale, image_url, old_price, new_price) VALUES
('LG Monitor Ultra HD 4K IPS 27 HDR 400 DCI-P3 95% 27UP650-W',     5, 1, './DataImage/LG Monitor Ultra HD 4K IPS 27 HDR 400 DCI-P3 95%25%2027UP650-W.png', 279.00,  250.00),
('Asus ROG Swift OLED PG27UCDM',                                  4, 0, './DataImage/Asus ROG Swift OLED PG27UCDM.png',                                   NULL,    1329.00),
('BenQ PhotoVue sw272u 27 4K HDR Monitor',                        5, 0, './DataImage/BenQ PhotoVue sw272u 27 4K HDR Monitor.png',                         NULL,    1500.00),
('Dell UltraSharp U2725QE',                                       5, 1, './DataImage/Dell UltraSharp U2725QE.png',                                         640.00,  608.00),
('Apple iPhone 17 Pro 256GB',                                     5, 1, './DataImage/Apple iPhone 17 Pro 256GB.png',                                       1450.00, 1329.00),
('Samsung Galaxy S26 Ultra 5G 12GB',                              4, 1, './DataImage/Samsung Galaxy S26 Ultra 5G 12GB.png',                                110.00,  95.00),
('Sony Alpha A7 IV',                                              5, 0, './DataImage/Sony Alpha A7 IV.png',                                                NULL,    1500.00),
('Sony WH-1000XM5',                                               4, 1, './DataImage/Sony WH-1000XM5.png',                                                 300.00,  265.00),
('Bose QuietComfort Ultra Headphones',                            5, 1, './DataImage/Bose QuietComfort Ultra Headphones.png',                              310.00,  265.00),
('Sonos Era 300 Bluetooth Speaker System E30G1US1',                5, 0, './DataImage/Sonos Era 300 Bluetooth Speaker System E30G1US1.png',                 NULL,    400.00),
('Router gaming Wifi 7 ASUS ROG Rapture GT-BE98 PRO',             4, 1, './DataImage/Router gaming Wifi 7 ASUS ROG Rapture GT-BE98 PRO.png',                1200.00, 1163.00),
('Tp-link BE900',                                                 5, 0, './DataImage/Tp-link BE900.png',                                                   NULL,    999.00),
('AMD Ryzen 9 9950X',                                             5, 0, './DataImage/AMD Ryzen 9 9950X.png',                                               NULL,    1500.00);
