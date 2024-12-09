-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2024 at 12:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `coops`
--

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  `status` enum('available','rented','maintenance') DEFAULT 'available',
  `picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `name`, `description`, `price`, `stock_quantity`, `status`, `picture`) VALUES
(12, 'Bea Alban Manalo', 'AWFWRG', 6000.00, 2, 'available', '1732407057014.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `first_name`, `middle_name`, `last_name`, `address`, `dob`, `email`, `gender`, `contact_number`, `user_id`, `status`) VALUES
(3, 'John', 'M', 'Doe', '123 Main St', '1985-05-15', 'john.doe@example.com', 'Male', '123-456-7890', 2, 'pending'),
(4, 'John', 'M', 'Doe', '123 Main St', '1985-05-15', 'john.doe@example.com', 'Male', '123-456-7890', 2, 'pending'),
(5, 'John Remuel', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '2002-08-22', 'limpot@gmail.com', 'Male', '09517412165', 3, 'pending'),
(8, 'Laireen', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '2003-12-08', 'laireenabrigante@gmail.com', 'Female', '09517412165', 6, 'approved'),
(9, 'Alfia', 'Alias', 'Bahia', 'Naujan Aurora', '2003-12-08', 'Alfia@gmail.com', 'Male', '09517412165', 7, 'approved'),
(10, 'John Reyven', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '2010-10-15', 'reyven@gmail.com', 'Male', '09517412165', 8, 'approved'),
(11, 'Myrna', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '1979-12-11', 'myrna@gmail.com', 'Female', '09517412165', 9, 'pending'),
(12, 'Alvin', 'Manalo', 'Villaverde', 'Ilaya', '2024-11-22', 'alvnvllavrd@gmail.com', 'Male', '09293934207', 10, 'approved'),
(13, 'Alvin', 'Manalo', 'Villaverde', 'Ilaya', '2024-11-24', 'alvnvllavrd@gmail.com', 'Male', '09293934207', 11, 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `product_id`, `quantity`, `total_price`, `created_at`, `status`) VALUES
(26, 11, 1, 1, 1200.00, '2024-11-24 16:37:43', 'Shipped'),
(27, 11, 1, 1, 1200.00, '2024-11-24 16:38:22', 'Pending'),
(28, 11, 1, 1, 1200.00, '2024-11-24 16:45:57', 'Delivered'),
(29, 11, 1, 1, 1200.00, '2024-11-24 16:46:55', 'Cancelled'),
(30, 11, 1, 1, 1200.00, '2024-11-24 16:51:30', 'Pending'),
(31, 11, 1, 1, 1200.00, '2024-11-24 16:51:39', 'Pending'),
(32, 11, 1, 1, 1200.00, '2024-11-24 16:57:54', 'Pending'),
(33, 11, 1, 1, 1200.00, '2024-11-24 17:01:45', 'Pending'),
(34, 11, 1, 1, 1200.00, '2024-11-24 17:07:10', 'shipped'),
(35, 11, 1, 1, 1200.00, '2024-11-24 17:34:17', 'Pending'),
(36, 11, 1, 1, 1200.00, '2024-11-24 17:37:38', 'Pending'),
(37, 11, 1, 1, 1200.00, '2024-11-24 18:35:42', 'Pending'),
(38, 11, 1, 1, 1200.00, '2024-11-24 18:35:50', 'Pending'),
(39, 10, 1, 1, 1200.00, '2024-11-24 18:39:50', 'Delivered'),
(40, 11, 1, 1, 1200.00, '2024-11-24 18:44:31', 'Pending'),
(41, 11, 2, 1, 1.00, '2024-11-24 19:05:27', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `picture` varchar(255) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `picture`, `price`, `stock`, `user_id`, `order_id`) VALUES
(1, 'hello', 'hi', '1732420513573.jpg', 1200.00, 61, 0, NULL),
(2, 'hello1', 'hii', '1732446298650.jpg', 1.00, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

CREATE TABLE `rentals` (
  `id` int(11) NOT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `rental_status` enum('pending','confirmed','returned','overdue') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('Admin','User') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`) VALUES
(1, 'Bea', '$2b$10$2./7BvjVUEdoEz3k.FB.4OpDlpRiEKweK07C/3EoJYlds9ikqvZOy', 'bea@gmail.com', 'User'),
(2, 'john_doe', 'password123', 'john.doe@example.com', 'User'),
(3, 'Limpot', '$2a$08$t2Jk2qZHQhfouPWRR/MvvO1dnC0oq54NbYHxDLXPPoacRNyvc15hq', 'limpot@gmail.com', 'Admin'),
(6, 'Laireen', '$2a$08$ie11XpcqFMMD3jQc4nEQUe3WNJaB7X3Tw5NrMTBxBljAWtJBJ7aBa', 'laireenabrigante@gmail.com', 'User'),
(7, 'Alfia', '$2a$08$fYS77YhKuNP/eUrb7h2DpOvHkmMg95a4g8dQzSSgvnpCWWgDM7Lyu', 'alfia@gmail.com', 'User'),
(8, 'Reyven', '$2a$08$OU/IutlxknHQ5qtWUPdJHu0lO19IExfs1j6/sFph2KVMClfN3GSz.', 'reyven@gmail.com', 'User'),
(9, 'Myrna', '$2a$08$ISpxqkHLjOZbs19bLW7QIOvAUYk3ex3d24kKsOybVPVWEFExpbFn6', 'myrna@gmail.com', 'User'),
(10, 'Moonlightbae1', '$2a$08$YHU0BRE3lMZCDygarO5rIOh6n/NRvkMFqm2hp/npwXye1KUTIVkmO', 'alvnvllavrd@gmail.com', 'Admin'),
(11, 'Moonlightbae2', '$2a$08$4nbIBQvXzR54lqYxetWc8edN.eZxx2PDHKF5/LdcKTegeo5vRE4H6', 'alvnvllavrd@gmail.com', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipment_id` (`equipment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`),
  ADD CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `rentals_ibfk_3` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
