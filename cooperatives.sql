-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 03, 2024 at 03:15 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cooperatives`
--

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
CREATE TABLE IF NOT EXISTS `equipment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rental_price` decimal(10,2) DEFAULT NULL,
  `available` enum('Yes','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `name`, `description`, `picture`, `rental_price`, `available`) VALUES
(1, 'Tractor', 'High-performance tractor suitable for all farming needs.', 'tractor.jpg', 150.00, 'Yes'),
(2, 'Plough', 'Heavy-duty plough ideal for tilling soil.', 'plough.jpg', 40.00, 'Yes'),
(3, 'Seed Drill', 'Precision seed drill for accurate planting.', 'seed_drill.jpg', 60.00, ''),
(4, 'Irrigation Pump', 'Efficient water pump for irrigation purposes.', 'irrigation_pump.jpg', 100.00, 'Yes'),
(5, 'Harvester', 'Powerful harvester for quick and efficient crop collection.', 'harvester.jpg', 200.00, '');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
CREATE TABLE IF NOT EXISTS `loans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `loan_term` int NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `member_id`, `amount`, `interest_rate`, `loan_term`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 5000.00, 5.00, 12, 'approved', '2024-11-03 02:21:11', '2024-11-03 02:54:59'),
(2, 2, 10000.00, 4.50, 24, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11'),
(3, 3, 15000.00, 6.00, 36, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11'),
(4, 4, 2000.00, 7.50, 6, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11'),
(5, 5, 25000.00, 5.50, 48, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11'),
(6, 6, 3000.00, 4.00, 18, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11'),
(7, 7, 12000.00, 3.50, 30, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11'),
(8, 8, 7000.00, 5.80, 12, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11'),
(9, 9, 1500.00, 8.00, 6, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11'),
(10, 10, 8000.00, 4.20, 24, '', '2024-11-03 02:21:11', '2024-11-03 02:21:11');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- Assuming there's a users table, this links each member to a user account
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    address VARCHAR(255),
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active',
    picture VARCHAR(255),  -- Path or URL to the member's picture
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



--
-- Dumping data for table `members`
--

INSERT INTO members (name, email, phone, address, join_date, status, picture) VALUES 
('Alice Smith', 'alice@example.com', '555-1234', '456 Elm St, Othertown', NOW(), 'active', 'alice_smith.jpg'),
('Bob Johnson', 'bob@example.com', '555-5678', '789 Maple St, Sometown', NOW(), 'active', 'bob_johnson.jpg'),
('Carol White', 'carol@example.com', '555-8765', '321 Oak St, Yourtown', NOW(), 'active', 'carol_white.jpg');


-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('online','loan_credit') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `picture`, `price`, `stock`) VALUES
(4, 'Fertilizer', 'High-quality plant fertilizer', 'fertilizer.jpg', 25.99, 100),
(5, 'Pesticide', 'Organic pesticide for plants', 'pesticide.jpg', 30.50, 200),
(6, 'Seed Pack', 'Mixed seeds for planting', 'seed_pack.jpg', 15.00, 150);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `transaction_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('online','loan_credit') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_general_ci DEFAULT 'user',
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `email`) VALUES
(1, 'Alfia', '$2a$08$lLhdAgZhyponwpOZLKn46uZPWQXylefbIGN04g/QEFKMhyJSyv7EG', 'user', ''),
(2, 'Lala', '$2a$08$IsgSiJIEtitl6EbrioU5w./a8kscIARgSr7xFJqnnMEgVcJ.NCdJK', 'user', ''),
(3, 'tytygygib', '$2a$08$TKDRaw8lY/Q7UybD7LbQuO7KQJEIeLPH0loWBYluIJql18ZROhvvm', 'user', ''),
(4, 'tytygygib', '$2a$08$05rStF95jFChA.tUV1gsFeTHiFZnPUmxI4jvsgpIjQt/Kx2XL0hAm', 'user', ''),
(5, 'Admin', 'admin123', 'admin', 'admin@example.com'),
(6, 'tytygygib', '$2a$08$ecj/RqTDwWHXbqgdMD42UOdOovB9oeWCVZciwOTkeEJyejiuaoJBq', 'user', 'laireenabrigante@gmail.com'),
(7, 'moon', 'alvin', 'admin', 'alvnvllavrd@gmail.com'),
(8, 'admin', '$2a$08$nzY9MX5vi6xB.3QSkKCXbu9E1OMGKrLtxp29ugXYKwVqP8kyEYLkm', 'user', 'alvnvllavrd@gmail.com'),
(9, 'tytygygib', '$2a$08$/eoaK3vB63plqB4/.ThTSu.eP28EDXBMY00AX/pcPZghCSZnhLWm2', 'admin', 'alvnvllavrd@gmail.com'),
(10, 'tytygygib', '$2a$08$0d27T9gFZx.ccQeN/ufGTOaLKd6fj8YZJ2N.msh91wlAJyLX50Yam', 'admin', 'alvnvllavrd@gmail.com');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
