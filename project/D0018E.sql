-- MySQL Workbench Forward Engineering

-- -----------------------------------------------------
-- Schema D0018E
-- -----------------------------------------------------

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
  `name` VARCHAR(60) NOT NULL,
  `price` INT UNSIGNED NOT NULL,
  `inventory` INT UNSIGNED NOT NULL,
  `description` VARCHAR(60) NOT NULL,
  `category` VARCHAR(45) NOT NULL,
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
-- Table `D0018E`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `D0018E`.`comment` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `comment` TEXT NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES D0018E.user(id),
  FOREIGN KEY (`product_id`) REFERENCES D0018e.product(id));

-- -----------------------------------------------------
-- Table `D0018E`.`order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `D0018E`.`order` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
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
  FOREIGN KEY (`order_id`) REFERENCES D0018E.order (id),
  FOREIGN KEY (`product_id`) REFERENCES D0018E.product (id));
