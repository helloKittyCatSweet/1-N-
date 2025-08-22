/*
 Navicat Premium Data Transfer

 Source Server         : demo
 Source Server Type    : MySQL
 Source Server Version : 80100
 Source Host           : localhost:3306
 Source Schema         : uniapp

 Target Server Type    : MySQL
 Target Server Version : 80100
 File Encoding         : 65001

 Date: 22/08/2025 15:16:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `count` int(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, 'frank caprio', '2025-08-22 14:51:34', 0, '2025-08-22 14:51:39');
INSERT INTO `categories` VALUES (2, 'mykasih', '2025-08-22 14:52:20', 0, '2025-08-22 14:52:25');
INSERT INTO `categories` VALUES (3, 'johor darul ta\'zim vs lion city sailors', '2025-08-22 14:52:37', 0, '2025-08-22 14:52:39');
INSERT INTO `categories` VALUES (4, 'eze', '2025-08-22 14:52:53', 0, '2025-08-22 14:52:57');
INSERT INTO `categories` VALUES (5, 'sumbangan asas rahmah', '2025-08-22 14:53:07', 0, '2025-08-22 14:53:10');
INSERT INTO `categories` VALUES (6, 'pixel 10', '2025-08-22 14:53:22', 0, '2025-08-22 14:53:26');
INSERT INTO `categories` VALUES (7, 'inter miami vs tigres uanl', '2025-08-22 14:53:34', 0, '2025-08-22 14:53:38');
INSERT INTO `categories` VALUES (8, 'jay fai bangkok', '2025-08-22 14:53:47', 0, '2025-08-22 14:53:50');
INSERT INTO `categories` VALUES (9, 'acc', '2025-08-22 14:54:03', 0, '2025-08-22 14:54:05');
INSERT INTO `categories` VALUES (10, 'coe prices', '2025-08-22 14:54:31', 0, '2025-08-22 14:54:38');
INSERT INTO `categories` VALUES (11, 'sbs transit punggol mrt negligence', '2025-08-22 14:54:46', 0, '2025-08-22 14:54:50');
INSERT INTO `categories` VALUES (12, 'la galaxy vs pachuca', '2025-08-22 14:55:02', 0, '2025-08-22 14:55:05');
INSERT INTO `categories` VALUES (13, 'grab singapore ride hailing fares glitch', '2025-08-22 14:55:16', 0, '2025-08-22 14:55:20');
INSERT INTO `categories` VALUES (14, 'yankee', '2025-08-22 14:55:27', 0, '2025-08-22 14:55:30');
INSERT INTO `categories` VALUES (15, 'fenerbahçe vs benfica', '2025-08-22 14:55:38', 0, '2025-08-22 14:55:42');
INSERT INTO `categories` VALUES (16, 'online casino', '2025-08-22 14:55:50', 0, '2025-08-22 14:55:57');
INSERT INTO `categories` VALUES (17, 'fireball meteor japan', '2025-08-22 14:56:05', 0, '2025-08-22 14:56:07');
INSERT INTO `categories` VALUES (18, 'qin xiao hedge fund', '2025-08-22 14:56:16', 0, '2025-08-22 14:56:20');
INSERT INTO `categories` VALUES (19, 'palantir share price', '2025-08-22 15:07:53', 0, '2025-08-22 15:07:56');
INSERT INTO `categories` VALUES (20, 'online lottery', '2025-08-22 15:08:11', 0, '2025-08-22 15:08:13');
INSERT INTO `categories` VALUES (21, 'vapes singapore', '2025-08-22 15:08:23', 0, '2025-08-22 15:08:26');
INSERT INTO `categories` VALUES (22, 'great eastern', '2025-08-22 15:08:38', 0, '2025-08-22 15:08:41');
INSERT INTO `categories` VALUES (23, 'kai havertz', '2025-08-22 15:08:52', 0, '2025-08-22 15:08:55');
INSERT INTO `categories` VALUES (24, 'andy sieg', '2025-08-22 15:09:32', 0, '2025-08-22 15:09:35');
INSERT INTO `categories` VALUES (25, 'toluca vs orlando city', '2025-08-22 15:09:42', 0, '2025-08-22 15:09:45');
INSERT INTO `categories` VALUES (26, 'nvidia share price', '2025-08-22 15:09:53', 0, '2025-08-22 15:09:55');

-- ----------------------------
-- Table structure for pictures
-- ----------------------------
DROP TABLE IF EXISTS `pictures`;
CREATE TABLE `pictures`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `picCateId` int(0) NOT NULL,
  `savePath` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `like` int(0) NOT NULL,
  `userId` int(0) NOT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf16 COLLATE = utf16_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'kitty wang', '$2b$10$wQBOowziFs/i1xOzbwjZSO3fxmWYCsCT7k7PZr5F.ApRJ.7Hj14MS', '2025-08-22 06:47:28', '2025-08-22 06:47:28');

SET FOREIGN_KEY_CHECKS = 1;
