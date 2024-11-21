-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2024 at 02:09 PM
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
(12, 'Bea Alban Manalo', 'AWFWRG', 6000.00, 0, 'maintenance', '1732194174786.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `farm_supply`
--

CREATE TABLE `farm_supply` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(10, 'John Reyven', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '2010-10-15', 'reyven@gmail.com', 'Male', '09517412165', 8, 'pending'),
(11, 'Myrna', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '1979-12-11', 'myrna@gmail.com', 'Female', '09517412165', 9, 'pending');

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
(9, 'Myrna', '$2a$08$ISpxqkHLjOZbs19bLW7QIOvAUYk3ex3d24kKsOybVPVWEFExpbFn6', 'myrna@gmail.com', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `farm_supply`
--
ALTER TABLE `farm_supply`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

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
-- AUTO_INCREMENT for table `farm_supply`
--
ALTER TABLE `farm_supply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `farm_supply`
--
ALTER TABLE `farm_supply`
  ADD CONSTRAINT `farm_supply_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `members` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
