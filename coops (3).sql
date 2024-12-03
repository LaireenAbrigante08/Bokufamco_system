-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2024 at 04:57 PM
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
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) GENERATED ALWAYS AS (`quantity` * `price`) STORED,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_name`, `quantity`, `price`, `created_at`, `updated_at`, `product_id`) VALUES
(37, 12, 'Ironite Spray', 1, 737.00, '2024-12-01 15:55:08', '2024-12-01 15:55:08', 2),
(38, 12, 'Organic Fertilizer', 1, 787.00, '2024-12-01 15:55:14', '2024-12-01 15:55:14', 3);

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
(12, 'Bea Alban Manalo', 'ytfd', 6000.00, 2, 'available', '1732407057014.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `loan_amount` decimal(10,2) NOT NULL,
  `loan_type` varchar(50) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `loan_status` varchar(50) DEFAULT 'pending',
  `months_to_pay` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `interest_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_repayment` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `user_id`, `loan_amount`, `loan_type`, `interest_rate`, `loan_status`, `months_to_pay`, `due_date`, `interest_amount`, `created_at`, `total_repayment`) VALUES
(19, 12, 1200.00, 'Personal', 0.20, 'active', 1, '2025-01-01', 240.00, '2024-12-01 15:37:20', 1440.00);

-- --------------------------------------------------------

--
-- Table structure for table `loan_payments`
--

CREATE TABLE `loan_payments` (
  `id` int(11) NOT NULL,
  `loan_id` int(11) NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending'
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
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  `share_capital` decimal(10,2) NOT NULL DEFAULT 0.00,
  `loan_balance` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `first_name`, `middle_name`, `last_name`, `address`, `dob`, `email`, `gender`, `contact_number`, `user_id`, `status`, `share_capital`, `loan_balance`) VALUES
(3, 'John', 'M', 'Doe', '123 Main St', '1985-05-15', 'john.doe@example.com', 'Male', '123-456-7890', 2, 'pending', 0.00, 0.00),
(4, 'John', 'M', 'Doe', '123 Main St', '1985-05-15', 'john.doe@example.com', 'Male', '123-456-7890', 2, 'pending', 0.00, 0.00),
(5, 'John Remuel', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '2002-08-22', 'limpot@gmail.com', 'Male', '09517412165', 3, 'pending', 0.00, 0.00),
(8, 'Laireen', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '2003-12-08', 'laireenabrigante@gmail.com', 'Female', '09517412165', 6, 'approved', 0.00, 0.00),
(9, 'Alfia', 'Alias', 'Bahia', 'Naujan Aurora', '2003-12-08', 'Alfia@gmail.com', 'Male', '09517412165', 7, 'approved', 0.00, 0.00),
(10, 'John Reyven', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '2010-10-15', 'reyven@gmail.com', 'Male', '09517412165', 8, 'approved', 0.00, 0.00),
(11, 'Myrna', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '1979-12-11', 'myrna@gmail.com', 'Female', '09517412165', 9, 'pending', 0.00, 0.00),
(12, 'Alvin', 'Manalo', 'Villaverde', 'Ilaya', '2024-11-22', 'alvnvllavrd@gmail.com', 'Male', '09293934207', 10, 'approved', 0.00, 0.00),
(13, 'Alvin', 'Manalo', 'Villaverde', 'Ilaya', '2024-11-24', 'alvnvllavrd@gmail.com', 'Male', '09293934207', 11, 'approved', 0.00, 0.00),
(14, 'John Remuel ', 'Alias', 'Abrigante', 'Sta. Rita. Calapan City', '2002-08-22', 'remuel@gmail.com', 'Male', '09517412165', 12, 'pending', 5000.00, 0.00),
(15, 'LAIREEN', 'MAE ALIAS', 'ABRIGANTE', 'Sta. Rita. Calapan City', '2003-12-08', 'laireenabrigante@gmail.com', 'Female', '09517412165', 13, 'pending', 7000.00, 0.00),
(16, 'LAIREEN', 'MAE ALIAS', 'ABRIGANTE', 'Sta. Rita. Calapan City', '2003-12-08', 'laireenabrigante@gmail.com', 'Female', '09517412165', 14, 'pending', 7000.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `delivery_address` text NOT NULL,
  `payment_method` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `status`, `created_at`, `delivery_address`, `payment_method`) VALUES
(8, 12, 350.00, 'Pending', '2024-12-01 08:29:36', 'efqfwef', 'Cash on Delivery'),
(10, 12, 837.00, 'Pending', '2024-12-01 08:42:13', 'dav xv ', 'Cash on Delivery'),
(12, 12, 50.00, 'Pending', '2024-12-01 11:21:15', 'shgvdaghkvagk', 'Cash on Delivery'),
(13, 12, 50.00, 'Pending', '2024-12-01 12:00:19', 'calapan', 'Cash on Delivery'),
(14, 12, 737.00, 'Delivered', '2024-12-01 13:39:11', 'wfrefveqf', 'Cash on Delivery');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`, `picture`) VALUES
(3, 8, 1, 'High Quality Talong Seeds', 7, 50.00, '1732945398135.png'),
(5, 10, 3, 'Organic Fertilizer', 1, 787.00, '1732945559024.png'),
(6, 10, 1, 'High Quality Talong Seeds', 1, 50.00, '1732945398135.png'),
(9, 12, 1, 'High Quality Talong Seeds', 1, 50.00, '1732945398135.png'),
(10, 13, 1, 'High Quality Talong Seeds', 1, 50.00, '1732945398135.png'),
(11, 14, 2, 'Ironite Spray', 1, 737.00, '1732945490755.png');

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
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `picture`, `price`, `stock`) VALUES
(1, 'High Quality Talong Seeds', 'Eggplant (Solanum melongena L.), locally known as \"talong\", is an important vegetable crop in the Philippines due to its high nutritional value and versatile culinary uses. It is a popular ingredient in many Filipino dishes, such as tortang talong, pinakbet, and adobo.', '1732945398135.png', 50.00, 75),
(2, 'Ironite Spray', 'Ironite is an iron-rich mineral supplement used on lawns to enhance greenness by aiding photosynthesis. Benefits include versatility, enriching lawns and nearby plants, Advanced Soil Technology, beneficial microbes used on all soil types, and no chemical burns.', '1732945490755.png', 737.00, 94),
(3, 'Organic Fertilizer', 'Organic fertilizer is an essential source of plant nutrients and soil. Organic fertilizers differ from chemical fertilizers in that they provide nutrients for your plants while creating healthy soil. They are considered a greener option.', '1732945559024.png', 787.00, 88),
(4, 'Pesticides', 'Pests can be insects, weeds, fungi, bacteria, rodents, or any other organism that reduces crop yield or quality.', '1732945658171.png', 340.00, 100);

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
(11, 'Moonlightbae2', '$2a$08$4nbIBQvXzR54lqYxetWc8edN.eZxx2PDHKF5/LdcKTegeo5vRE4H6', 'alvnvllavrd@gmail.com', 'User'),
(12, 'Remuel', '$2a$08$Nl2ZloOqIPameFJE4u9d2eZeUdzKTKoSrPpx408p7L.AQpbEc/dXe', 'remuel@gmail.com', 'User'),
(13, 'Remuel', '$2a$08$jvh1CtSKQFn2/lDE/FhesuETnnipxViDiRqJPTt0C7aujAU2n5ugO', 'laireenabrigante@gmail.com', 'User'),
(14, 'Remuel', '$2a$08$mSlZ95VbAVv3KGsF0HjR7uLvlDh40x6XVHHdgSPGacYtQNyv2CTLi', 'laireenabrigante@gmail.com', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `loan_payments`
--
ALTER TABLE `loan_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loan_id` (`loan_id`);

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
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `loan_payments`
--
ALTER TABLE `loan_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

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
