-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： db
-- 產生時間： 2024 年 03 月 31 日 13:34
-- 伺服器版本： 10.4.8-MariaDB-1:10.4.8+maria~bionic
-- PHP 版本： 8.2.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `cake`
--
CREATE DATABASE IF NOT EXISTS `cake` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cake`;

-- --------------------------------------------------------

--
-- 資料表結構 `faq`
--

CREATE TABLE `faq` (
  `Id` int(11) NOT NULL,
  `LayerId` int(11) NOT NULL,
  `Sequence` int(11) NOT NULL,
  `Title` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='購物須知資料表';

--
-- 觸發器 `faq`
--
DELIMITER $$
CREATE TRIGGER `faq_update_timestamp` BEFORE UPDATE ON `faq` FOR EACH ROW SET NEW.updated_at = NOW()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 資料表結構 `faq-layer`
--

CREATE TABLE `faq-layer` (
  `Id` int(11) NOT NULL,
  `Name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '購物須知類別名稱',
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='購物須知類別表';

--
-- 觸發器 `faq-layer`
--
DELIMITER $$
CREATE TRIGGER `faq-layer_update_timestamp` BEFORE UPDATE ON `faq-layer` FOR EACH ROW SET NEW.updated_at = NOW()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 資料表結構 `member`
--

CREATE TABLE `member` (
  `Id` int(11) NOT NULL,
  `Account` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Pwd` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HomePhone` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MobilePhone` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `BirthDay` date NOT NULL COMMENT '1999-01-01',
  `Sex` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'M:男/F:女',
  `Level` int(11) NOT NULL DEFAULT 1,
  `LevelExpirationDate` timestamp NULL DEFAULT NULL,
  `TotalSpent` int(11) NOT NULL DEFAULT 0,
  `TotalSpenttExpirationDate` timestamp NULL DEFAULT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='會員資料表';

-- --------------------------------------------------------

--
-- 資料表結構 `news`
--

CREATE TABLE `news` (
  `Id` int(11) NOT NULL,
  `LayerId` int(11) NOT NULL,
  `Title` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Sub` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Thumbnail` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `DOA` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='最新消息資料表';

-- --------------------------------------------------------

--
-- 資料表結構 `news-layer`
--

CREATE TABLE `news-layer` (
  `Id` int(11) NOT NULL,
  `Name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '最新消息類別名稱',
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='最新消息類別表';

--
-- 觸發器 `news-layer`
--
DELIMITER $$
CREATE TRIGGER `news-layer_update_timestamp` BEFORE UPDATE ON `news-layer` FOR EACH ROW SET NEW.updated_at = NOW()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 資料表結構 `product-layer`
--

CREATE TABLE `product-layer` (
  `Id` int(11) NOT NULL,
  `Name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '產品類別名稱',
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='產品類別表';

--
-- 觸發器 `product-layer`
--
DELIMITER $$
CREATE TRIGGER `product-layer_update_timestamp` BEFORE UPDATE ON `product-layer` FOR EACH ROW SET NEW.updated_at = NOW()
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 資料表結構 `story`
--

CREATE TABLE `story` (
  `Id` int(11) NOT NULL,
  `Title` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Sequence` int(11) NOT NULL DEFAULT 0,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='品牌故事資料表';

--
-- 觸發器 `story`
--
DELIMITER $$
CREATE TRIGGER `story_update_timestamp` BEFORE UPDATE ON `story` FOR EACH ROW SET NEW.updated_at = NOW()
$$
DELIMITER ;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`Id`);

--
-- 資料表索引 `faq-layer`
--
ALTER TABLE `faq-layer`
  ADD PRIMARY KEY (`Id`);

--
-- 資料表索引 `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`Id`);

--
-- 資料表索引 `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`Id`);

--
-- 資料表索引 `news-layer`
--
ALTER TABLE `news-layer`
  ADD PRIMARY KEY (`Id`);

--
-- 資料表索引 `product-layer`
--
ALTER TABLE `product-layer`
  ADD PRIMARY KEY (`Id`);

--
-- 資料表索引 `story`
--
ALTER TABLE `story`
  ADD PRIMARY KEY (`Id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `faq`
--
ALTER TABLE `faq`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `faq-layer`
--
ALTER TABLE `faq-layer`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `member`
--
ALTER TABLE `member`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `news`
--
ALTER TABLE `news`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `news-layer`
--
ALTER TABLE `news-layer`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product-layer`
--
ALTER TABLE `product-layer`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `story`
--
ALTER TABLE `story`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
