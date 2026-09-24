-- ==========================================================
-- ProjectHub: Student Project Collaboration & Management System
-- MySQL Database Schema
-- Compatible with MySQL 8.0+ / MariaDB 10.4+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `projecthub_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `projecthub_db`;

-- Drop tables in reverse order of foreign keys
DROP TABLE IF EXISTS `system_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `evaluations`;
DROP TABLE IF EXISTS `feedbacks`;
DROP TABLE IF EXISTS `discussions`;
DROP TABLE IF EXISTS `code_snippets`;
DROP TABLE IF EXISTS `project_files`;
DROP TABLE IF EXISTS `milestones`;
DROP TABLE IF EXISTS `project_members`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `users`;

-- 1. USERS TABLE
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
    `roll_or_faculty_id` VARCHAR(50) NULL,
    `department` VARCHAR(100) NOT NULL DEFAULT 'Computer Science & Engineering',
    `phone` VARCHAR(20) NULL,
    `bio` TEXT NULL,
    `skills` VARCHAR(255) NULL,
    `avatar_url` VARCHAR(255) NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_approved` (`is_approved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. PROJECTS TABLE
CREATE TABLE `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `abstract` TEXT NOT NULL,
    `domain` VARCHAR(100) NOT NULL,
    `tech_stack` VARCHAR(255) NOT NULL,
    `github_url` VARCHAR(255) NULL,
    `live_demo_url` VARCHAR(255) NULL,
    `status` ENUM('draft', 'guide_pending', 'approved', 'in_progress', 'under_review', 'evaluated', 'rejected') NOT NULL DEFAULT 'guide_pending',
    `progress_percent` INT NOT NULL DEFAULT 0,
    `created_by_id` INT NOT NULL,
    `faculty_guide_id` INT NULL,
    `final_submission_notes` TEXT NULL,
    `final_submission_file` VARCHAR(255) NULL,
    `final_submission_date` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`faculty_guide_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_projects_status` (`status`),
    INDEX `idx_projects_domain` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. PROJECT MEMBERS TABLE (2-4 members per team)
CREATE TABLE `project_members` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `role_in_team` VARCHAR(100) NOT NULL DEFAULT 'Member',
    `status` ENUM('pending', 'joined', 'declined') NOT NULL DEFAULT 'joined',
    `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_project_user` (`project_id`, `user_id`),
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. MILESTONES TABLE
CREATE TABLE `milestones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `due_date` DATE NOT NULL,
    `weight_percent` INT NOT NULL DEFAULT 20,
    `status` ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
    `completed_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    INDEX `idx_milestones_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. PROJECT FILES TABLE
CREATE TABLE `project_files` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `uploaded_by_id` INT NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `file_category` ENUM('SRS', 'Design', 'Documentation', 'Code', 'Report', 'Presentation', 'Other') NOT NULL DEFAULT 'Documentation',
    `file_type` VARCHAR(50) NOT NULL,
    `file_size_kb` INT NOT NULL DEFAULT 0,
    `file_path` VARCHAR(255) NOT NULL,
    `version` VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    `description` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`uploaded_by_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. CODE SNIPPETS / COLLABORATION TABLE
CREATE TABLE `code_snippets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `author_id` INT NOT NULL,
    `file_name` VARCHAR(150) NOT NULL,
    `language` VARCHAR(50) NOT NULL DEFAULT 'python',
    `code_content` LONGTEXT NOT NULL,
    `commit_message` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. DISCUSSIONS TABLE
CREATE TABLE `discussions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. FEEDBACKS TABLE
CREATE TABLE `feedbacks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL,
    `faculty_id` INT NOT NULL,
    `milestone_id` INT NULL,
    `feedback_text` TEXT NOT NULL,
    `remarks_type` ENUM('General', 'Correction', 'Milestone Review', 'Code Review', 'Approval') NOT NULL DEFAULT 'General',
    `rating` INT NOT NULL DEFAULT 5,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`faculty_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`milestone_id`) REFERENCES `milestones`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. EVALUATIONS TABLE (Rubric Evaluation /100)
CREATE TABLE `evaluations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `project_id` INT NOT NULL UNIQUE,
    `faculty_id` INT NOT NULL,
    `marks_presentation` INT NOT NULL DEFAULT 0,
    `marks_code_quality` INT NOT NULL DEFAULT 0,
    `marks_documentation` INT NOT NULL DEFAULT 0,
    `marks_viva` INT NOT NULL DEFAULT 0,
    `marks_innovation` INT NOT NULL DEFAULT 0,
    `total_marks` INT NOT NULL DEFAULT 0,
    `grade` VARCHAR(10) NOT NULL DEFAULT 'A',
    `final_verdict` ENUM('Approved', 'Revision Required', 'Rejected') NOT NULL DEFAULT 'Approved',
    `remarks` TEXT NULL,
    `evaluated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`faculty_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. NOTIFICATIONS TABLE
CREATE TABLE `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `link` VARCHAR(255) NULL,
    `type` ENUM('info', 'success', 'warning', 'danger') NOT NULL DEFAULT 'info',
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_notif_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. SYSTEM AUDIT LOGS
CREATE TABLE `system_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `action` VARCHAR(255) NOT NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(50) NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
