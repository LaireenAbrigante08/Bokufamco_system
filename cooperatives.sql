-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2024 at 01:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `rental_price` decimal(10,2) DEFAULT NULL,
  `available` enum('Yes','No') DEFAULT NULL
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
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `loan_term` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
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
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `join_date` datetime DEFAULT current_timestamp(),
  `status` enum('active','inactive') DEFAULT 'active',
  `picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `user_id`, `name`, `email`, `phone`, `address`, `join_date`, `status`, `picture`, `created_at`) VALUES
(6, 1, 'John Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Anytown, USA', '2024-11-06 20:28:30', 'active', 'path/to/johndoe.jpg', '2024-11-06 15:35:34'),
(7, 2, 'Jane Smith', 'jane.smith@example.com', '987-654-3210', '456 Elm St, Othertown, USA', '2024-11-06 20:28:30', 'active', 'path/to/janesmith.jpg', '2024-11-06 15:35:34'),
(8, 3, 'Michael Johnson', 'michael.j@example.com', '555-666-7777', '789 Oak St, Smalltown, USA', '2024-11-06 20:28:30', 'inactive', 'path/to/michaeljohnson.jpg', '2024-11-06 15:35:34'),
(9, 4, 'Emily Davis', 'emily.d@example.com', '444-333-2222', '101 Maple Ave, New City, USA', '2024-11-06 20:28:30', 'active', 'path/to/emilydavis.jpg', '2024-11-06 15:35:34');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('online','loan_credit') DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `picture` varchar(255) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL
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
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `transaction_amount` decimal(10,2) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','User/Member') NOT NULL DEFAULT 'User/Member',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'johndoe', 'john.doe@example.com', 'hashed_password_1', 'User/Member', '2024-11-06 15:35:16'),
(2, 'janesmith', 'jane.smith@example.com', 'hashed_password_2', 'User/Member', '2024-11-06 15:35:16'),
(3, 'michaelj', 'michael.j@example.com', 'hashed_password_3', 'User/Member', '2024-11-06 15:35:16'),
(4, 'emilyd', 'emily.d@example.com', 'hashed_password_4', 'User/Member', '2024-11-06 15:35:16'),
(5, 'chrisb', 'chris.b@example.com', 'hashed_password_5', 'Admin', '2024-11-06 15:35:16'),
(14, 'Laireen', 'laireenabrigante@gmail.com', '$2a$08$Y4zdKmg0rEXmJEycv71TLOTGMyTMAoYz2mHtFsyO9IyDOSQuSRD2i', 'User/Member', '2024-11-06 15:35:16'),
(15, 'LaireenM', 'lai@gmail.com', '$2a$08$eVftOWylr415QUHMDRlCkuCoXUJJVcjXm7..kSzVuf5dLX2pCFJPC', 'Admin', '2024-11-06 15:35:16'),
(16, 'Sunshyne', 'abrigante@gmail.com', '$2a$08$RJPhyQCkUNS9ZhramgcY7ex.PbgcHNrprJeTBDBE3kXXCDA3rtDRe', 'User/Member', '2024-11-07 08:59:59');

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
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
