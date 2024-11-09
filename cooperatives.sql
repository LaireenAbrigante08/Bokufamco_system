-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 09, 2024 at 01:38 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

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

CREATE TABLE `equipment` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `picture` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rental_price` decimal(10,2) DEFAULT NULL,
  `available` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `name`, `description`, `picture`, `rental_price`, `available`) VALUES
(1, 'Tractor', 'High-performance tractor suitable for all farming needs.', 'tractor.jpg', 150.00, 'Yes'),
(2, 'Plough', 'Heavy-duty plough ideal for tilling soil.', 'plough.jpg', 40.00, 'Yes'),
(3, 'Seed Drill', 'Precision seed drill for accurate planting.', 'seed_drill.jpg', 60.00, NULL),
(4, 'Irrigation Pump', 'Efficient water pump for irrigation purposes.', 'irrigation_pump.jpg', 100.00, 'Yes'),
(5, 'Harvester', 'Powerful harvester for quick and efficient crop collection.', 'harvester.jpg', 200.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `id` int NOT NULL,
  `member_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `loan_term` int NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `member_id`, `amount`, `interest_rate`, `loan_term`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 5000.00, 5.00, 12, 'approved', '2024-11-02 18:21:11', '2024-11-02 18:54:59'),
(2, 2, 10000.00, 4.50, 24, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11'),
(3, 3, 15000.00, 6.00, 36, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11'),
(4, 4, 2000.00, 7.50, 6, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11'),
(5, 5, 25000.00, 5.50, 48, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11'),
(6, 6, 3000.00, 4.00, 18, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11'),
(7, 7, 12000.00, 3.50, 30, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11'),
(8, 8, 7000.00, 5.80, 12, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11'),
(9, 9, 1500.00, 8.00, 6, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11'),
(10, 10, 8000.00, 4.20, 24, '', '2024-11-02 18:21:11', '2024-11-02 18:21:11');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `address` text,
  `dob` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `id_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `first_name`, `middle_name`, `last_name`, `address`, `dob`, `email`, `gender`, `id_number`, `contact_number`) VALUES
(1, 'Allen', 'Magmanlac', 'Dinglasan', 'Baco', '2000-12-02', 'allen@gmail.com', 'Male', '321', '09876543212'),
(4, 'Nathan', 'Ramirez', 'Dela Cruz', 'Calapan City', '2000-01-02', 'nathan@gmail.com', 'Male', '6', '09293934207'),
(5, 'Alvin', 'Manalo', 'Villaverde', 'ilaya Calapan', '2001-09-28', 'alvinn@gmail.com', 'Male', '1214', '09293934207'),
(6, 'Laireen', 'Alias', 'Abrigante', 'Calapan City', '2001-02-09', 'abrigante@gmail.com', 'Female', '1213', '09456382013'),
(10, 'Laireen', 'Ramirez', 'Dinglasan', 'Calapan City', '2000-11-12', 'abrigante@gmail.com', 'Female', '124314', '09876543212'),
(15, 'Laireen', 'Ramirez', 'Abrigante', 'a', '2001-02-08', 'abrigante@gmail.com', 'Female', '12122', '09876543212');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `member_id` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('online','loan_credit') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `picture` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `transaction_amount` decimal(10,2) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Alvin', 'alvin@gmail.com', '$2a$08$2dEoxqOp4TQuD9CfsXJDx.ZpRwwejQvplnrxAZrXd9uwktucWWJpi', 'Admin', '2024-11-08 09:14:40'),
(2, 'Laireen', 'lai@gmail.com', '$2a$08$cGqfRnyKwE7ifaL0u2Acl.xH4lKtkL0HfZG07ZGytX/g7dMMn.rsS', 'Members', '2024-11-08 10:25:49'),
(3, 'Jam', 'jam@gmail.com', '$2a$08$THrnQGwYki4KbL.FhZTpE.gN5vb4tmE07TYk4CupBKZNmtnMxldXm', 'Members', '2024-11-08 10:26:38'),
(4, 'jam', 'jamaica@gmail.com', '$2a$08$fKIic9zQkq3qamkDNoBFw.DRXZvaUtpURHVkpseLHSYaP9xrFm1zy', 'User/Member', '2024-11-09 02:21:58'),
(5, 'roy', 'roy@gmail.com', '$2a$08$6FA/3Tf/4xv3lktyGgHEwufSsogwhedmkkRmcl3/iDrwI1z2F2Gfe', 'User/Member', '2024-11-09 02:24:29'),
(6, 'nathan', 'nathan@gmail.com', '$2a$08$8WY1V70wAlbcMJSR6KKNteUhuf9ywDIA3sOaYqA/LB5UO.arYmcL.', 'User/Member', '2024-11-09 02:25:03'),
(7, 'rex', 'rex@gmail.com', '$2a$08$f0IA3YOD2YVL2VZapSsRJuOtCtaSduUXhYwvl4qAgDVdpHAekhoPW', 'User/Member', '2024-11-09 02:26:18'),
(9, 'moonlight', 'alvinn@gmail.com', '$2a$08$x9qXQJkeYX6bAYCPuhR.kOBlOIom8YcyHP08ucCGOf6YhhrNSlz76', 'User/Member', '2024-11-09 02:34:50'),
(10, 'Abrigante', 'abrigante@gmail.com', '$2a$08$xxi6igzTuMeXESiBMdhT/.Oa5h5fh7pWImdmIEiOmn5TxEIVoEr6W', 'User/Member', '2024-11-09 02:44:56'),
(11, 'Allen', 'allen@gmail.com', '$2a$08$DhSevL/owwDHiCUppuHmQeQux5I3NC4kiPfD/08DLEvPPihxl3aXu', 'User/Member', '2024-11-09 06:31:10'),
(12, 'Bebe', 'bebe@gmail.com', '$2a$08$rfhhp.NzDI7L/cjwV2wHJ.ZP8B3o3cWZNRn7phBkuDT8wUR6pipxa', 'User/Member', '2024-11-09 08:36:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_number` (`id_number`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
