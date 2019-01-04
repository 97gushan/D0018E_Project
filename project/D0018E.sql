-- -----------------------------------------------------
-- Schema D0018E
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `D0018E` DEFAULT CHARACTER SET utf8 ;
USE `D0018E` ;

-- -----------------------------------------------------
-- Table `D0018E`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `D0018E`.`product` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` TEXT NOT NULL,
  `price` INT UNSIGNED NOT NULL,
  `inventory` INT NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(45) NOT NULL,
  `available` TINYINT(1) NOT NULL,
  `image_path` VARCHAR(1024),
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Table `D0018E`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `D0018E`.`user` (
  `username` VARCHAR(60) NOT NULL,
  `passwordhash` VARCHAR(100) NOT NULL,
  `adminflag` TINYINT(1) NOT NULL,
  `rating` DOUBLE UNSIGNED NOT NULL,
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Table `D0018E`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `D0018E`.`review` (
  `rating` INT UNSIGNED,
  `comment` TEXT,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES D0018E.user(id),
  FOREIGN KEY (`product_id`) REFERENCES D0018E.product(id));

-- -----------------------------------------------------
-- Table `D0018E`.`order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `D0018E`.`orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT UNSIGNED NOT NULL,
  `status` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES D0018E.user (id));

-- -----------------------------------------------------
-- Table `D0018E`.`order_item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `D0018E`.`order_item` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `amount` INT UNSIGNED NOT NULL,
  `price` INT UNSIGNED NOT NULL,
  `order_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES D0018E.orders (id),
  FOREIGN KEY (`product_id`) REFERENCES D0018E.product (id));

-- -----------------------------------------------------
-- Table `D0018E`.`shopping_basket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `D0018E`.`shopping_basket` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `price` INT UNSIGNED NOT NULL,
  `amount` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES D0018E.user (id),
FOREIGN KEY (`product_id`) REFERENCES D0018E.product (id));
