CREATE TABLE `User` (
  `id` int PRIMARY KEY,
  `role_id` int,
  `name` varchar(255),
  `sub` varchar(255),
  `email` varchar(255) UNIQUE
);

CREATE TABLE `Vendor_User` (
  `id` int PRIMARY KEY,
  `vendor_id` int UNIQUE,
  `user_id` int UNIQUE
);

CREATE TABLE `Vendor` (
  `id` int PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `Dish` (
  `id` int PRIMARY KEY,
  `vendor_id` int,
  `name` varchar(255),
  `price` decimal(10,2)
);

CREATE TABLE `OrderStatus` (
  `id` int PRIMARY KEY,
  `name` varchar(255),
  `isVendorControlled` bool
);

CREATE TABLE `Order` (
  `id` int PRIMARY KEY,
  `user_id` int,
  `status_id` int,
  `created_at` datetime,
  `updated_at` datetime,
  `delivered_at` datetime,
  `completed_at` datetime
);

CREATE TABLE `Order_Dish` (
  `id` int PRIMARY KEY,
  `dish_id` int,
  `order_dish_status_id` int,
  `rating_id` int,
  `order_id` int
);

CREATE TABLE `Order_Dish_Status` (
  `id` int PRIMARY KEY,
  `name` varchar(255),
  `isVendorControlled` bool
);

CREATE TABLE `Rating` (
  `id` int PRIMARY KEY,
  `score` int
);

CREATE TABLE `Role` (
  `id` int PRIMARY KEY,
  `name` varchar(255)
);

ALTER TABLE `User` ADD FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`);

ALTER TABLE `Vendor_User` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `Vendor` ADD FOREIGN KEY (`id`) REFERENCES `Vendor_User` (`vendor_id`);

ALTER TABLE `Dish` ADD FOREIGN KEY (`vendor_id`) REFERENCES `Vendor` (`id`);

ALTER TABLE `Order_Dish` ADD FOREIGN KEY (`rating_id`) REFERENCES `Rating` (`id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`status_id`) REFERENCES `OrderStatus` (`id`);

ALTER TABLE `Order_Dish` ADD FOREIGN KEY (`dish_id`) REFERENCES `Dish` (`id`);

ALTER TABLE `Order_Dish` ADD FOREIGN KEY (`order_id`) REFERENCES `Order` (`id`);

ALTER TABLE `Order_Dish` ADD FOREIGN KEY (`order_dish_status_id`) REFERENCES `Order_Dish_Status` (`id`);

ALTER TABLE `User` ADD FOREIGN KEY (`email`) REFERENCES `User` (`sub`);
