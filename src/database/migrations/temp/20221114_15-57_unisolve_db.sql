# ************************************************************
# Sequel Ace SQL dump
# Version 20035
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: ls-03a76c10579a258436b330b94f51593549b70422.chqqmkdqkqez.ap-south-1.rds.amazonaws.com (MySQL 8.0.28)
# Database: unisolve_db
# Generation Time: 2022-11-14 10:27:01 +0000
# ************************************************************



#SET NAMES utf8mb4;


SET CHECKS = 0

# Dump of table admins
# ------------------------------------------------------------

CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table badges
# ------------------------------------------------------------

CREATE TABLE `badges` (
  `badge_id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `desc` longtext,
  `icon` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`badge_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table challenge_questions
# ------------------------------------------------------------

CREATE TABLE `challenge_questions` (
  `challenge_question_id` int NOT NULL AUTO_INCREMENT,
  `challenge_id` int NOT NULL,
  `question_no` int DEFAULT NULL,
  `question` text NOT NULL,
  `description` text,
  `option_a` text NOT NULL,
  `option_b` text NOT NULL,
  `option_c` text,
  `option_d` text,
  `correct_ans` text NOT NULL,
  `type` enum('MCQ','MRQ','DRAW','TEXT') NOT NULL DEFAULT 'MRQ',
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`challenge_question_id`),
  KEY `challenge_id` (`challenge_id`),
  KEY `IDX_CHALQSTN_QNO` (`question_no`),
  CONSTRAINT `challenge_questions_ibfk_1` FOREIGN KEY (`challenge_id`) REFERENCES `challenges` (`challenge_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table challenge_responses
# ------------------------------------------------------------

CREATE TABLE `challenge_responses` (
  `challenge_response_id` int NOT NULL AUTO_INCREMENT,
  `challenge_id` int NOT NULL,
  `idea_name` varchar(255) DEFAULT NULL,
  `team_id` int NOT NULL,
  `response` longtext NOT NULL,
  `initiated_by` int DEFAULT NULL,
  `submitted_by` int DEFAULT NULL,
  `status` enum('DRAFT','SUBMITTED','EVALUATION','SELECTEDROUND1','REJECTEDROUND1') NOT NULL DEFAULT 'DRAFT',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`challenge_response_id`),
  KEY `FK_CHALRES_CHALID` (`challenge_id`),
  KEY `FK_CHALRES_TEAMID` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table challenges
# ------------------------------------------------------------

CREATE TABLE `challenges` (
  `challenge_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`challenge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table course_modules
# ------------------------------------------------------------

CREATE TABLE `course_modules` (
  `course_module_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`course_module_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table course_topics
# ------------------------------------------------------------

CREATE TABLE `course_topics` (
  `course_topic_id` int NOT NULL AUTO_INCREMENT,
  `course_module_id` int NOT NULL,
  `topic_type_id` int DEFAULT NULL,
  `topic_type` enum('VIDEO','WORKSHEET','QUIZ','ATTACHMENT','CERTIFICATE') NOT NULL DEFAULT 'VIDEO',
  `title` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`course_topic_id`),
  KEY `course_module_id` (`course_module_id`),
  KEY `IDX_CTOP_TOPTYPID` (`topic_type_id`),
  KEY `IDX_CTOP_TOPTYP` (`topic_type`),
  CONSTRAINT `course_topics_ibfk_1` FOREIGN KEY (`course_module_id`) REFERENCES `course_modules` (`course_module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table courses
# ------------------------------------------------------------

CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `thumbnail` varchar(255) DEFAULT '/images/default.jpg',
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table dashboard_map_stats
# ------------------------------------------------------------

CREATE TABLE `dashboard_map_stats` (
  `dashboard_map_stat_id` int NOT NULL AUTO_INCREMENT,
  `district_name` varchar(255) NOT NULL,
  `overall_schools` varchar(255) NOT NULL,
  `reg_schools` varchar(255) NOT NULL,
  `teams` varchar(255) NOT NULL,
  `ideas` varchar(255) NOT NULL,
  `students` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`dashboard_map_stat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table evaluators
# ------------------------------------------------------------

CREATE TABLE `evaluators` (
  `evaluator_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`evaluator_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `evaluators_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table faq_categories
# ------------------------------------------------------------

CREATE TABLE `faq_categories` (
  `faq_category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`faq_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table faqs
# ------------------------------------------------------------

CREATE TABLE `faqs` (
  `faq_id` int NOT NULL AUTO_INCREMENT,
  `faq_category_id` int NOT NULL,
  `question` longtext NOT NULL,
  `answer` longtext NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`faq_id`),
  KEY `Fk_FAQ_FCATID` (`faq_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table logs
# ------------------------------------------------------------

CREATE TABLE `logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `log_type` enum('INFO','ERROR','WARNING','DEBUG','CRITICAL','SUCCESS','FAILURE','LOGIN','LOGOUT','INBOUND','OUTBOUND') NOT NULL DEFAULT 'INFO',
  `date` datetime NOT NULL,
  `message` varchar(255) DEFAULT 'OK',
  `ip` varchar(50) NOT NULL,
  `method` enum('GET','POST','PUT','DELETE','OPTIONS') DEFAULT NULL,
  `route` longtext NOT NULL,
  `status_code` enum('200','400','401','403','404','500') NOT NULL DEFAULT '200',
  `token` longtext,
  `headers` longtext,
  `req_body` longtext,
  `res_body` longtext,
  `user_details` longtext,
  `logged_at` datetime NOT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table mentor_attachments
# ------------------------------------------------------------

CREATE TABLE `mentor_attachments` (
  `mentor_attachment_id` int NOT NULL AUTO_INCREMENT,
  `description` longtext,
  `attachments` longtext NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`mentor_attachment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table mentor_course_topics
# ------------------------------------------------------------

CREATE TABLE `mentor_course_topics` (
  `mentor_course_topic_id` int NOT NULL AUTO_INCREMENT,
  `mentor_course_id` int NOT NULL,
  `topic_type_id` int DEFAULT NULL,
  `topic_type` enum('VIDEO','WORKSHEET','QUIZ','ATTACHMENT','CERTIFICATE') NOT NULL DEFAULT 'VIDEO',
  `title` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`mentor_course_topic_id`),
  KEY `FK_MCTOP_MCID` (`mentor_course_id`),
  KEY `FK_MCTOP_TOPTYPID` (`topic_type_id`),
  KEY `FK_MCTOP_TOPTYP` (`topic_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table mentor_courses
# ------------------------------------------------------------

CREATE TABLE `mentor_courses` (
  `mentor_course_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext,
  `thumbnail` varchar(255) DEFAULT '/images/default.jpg',
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`mentor_course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table mentor_topic_progress
# ------------------------------------------------------------

CREATE TABLE `mentor_topic_progress` (
  `mentor_topic_progress_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `mentor_course_topic_id` int NOT NULL,
  `status` enum('COMPLETED','INCOMPLETE') DEFAULT 'INCOMPLETE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`mentor_topic_progress_id`),
  KEY `FK_MNTRTOPPROG_USRID` (`user_id`),
  KEY `FK_MNTRTOPPROF_MCTOPID` (`mentor_course_topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table mentors
# ------------------------------------------------------------

CREATE TABLE `mentors` (
  `mentor_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `organization_code` varchar(255) DEFAULT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `qualification` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `reg_status` enum('0','1','2','3') DEFAULT '0',
  `otp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mentor_id`),
  UNIQUE KEY `mobile_UNIQUE` (`mobile`),
  KEY `user_id` (`user_id`),
  KEY `organization_code` (`organization_code`),
  KEY `FK_MNTR_TEAMID` (`team_id`),
  KEY `IDX_MNTR_DSTRCT` (`district`),
  CONSTRAINT `mentors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `mentors_ibfk_2` FOREIGN KEY (`organization_code`) REFERENCES `organizations` (`organization_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table my_migrations_table
# ------------------------------------------------------------

CREATE TABLE `my_migrations_table` (
  `name` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table notifications
# ------------------------------------------------------------

CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_type` enum('EMAIL','SMS','PUSH') NOT NULL DEFAULT 'PUSH',
  `target_audience` longtext NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Notification',
  `image` varchar(255) DEFAULT NULL,
  `message` longtext NOT NULL,
  `read_by` longtext,
  `status` enum('DRAFT','PUBLISHED','DELETED') NOT NULL DEFAULT 'DRAFT',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `IDX_NOTIF_NTYPE` (`notification_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table organizations
# ------------------------------------------------------------

CREATE TABLE `organizations` (
  `organization_id` int NOT NULL AUTO_INCREMENT,
  `organization_name` varchar(255) NOT NULL,
  `organization_code` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `principal_name` varchar(255) DEFAULT NULL,
  `principal_mobile` varchar(255) DEFAULT NULL,
  `principal_email` varchar(255) DEFAULT NULL,
  `status` enum('NEW','ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`organization_id`),
  KEY `organizations_organization_code` (`organization_code`),
  KEY `IDX_ORG_DSTRCT` (`district`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table quiz
# ------------------------------------------------------------

CREATE TABLE `quiz` (
  `quiz_id` int NOT NULL AUTO_INCREMENT,
  `no_of_questions` int NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table quiz_questions
# ------------------------------------------------------------

CREATE TABLE `quiz_questions` (
  `quiz_question_id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `question_no` int DEFAULT NULL,
  `question` text NOT NULL,
  `option_a` text NOT NULL,
  `option_b` text NOT NULL,
  `option_c` text,
  `option_d` text,
  `correct_ans` text NOT NULL,
  `level` enum('HARD','MEDIUM','EASY') NOT NULL DEFAULT 'HARD',
  `type` enum('MCQ','MRQ','DRAW','TEXT') NOT NULL DEFAULT 'MRQ',
  `redirect_to` int DEFAULT NULL,
  `question_image` text,
  `question_icon` text,
  `msg_ans_correct` text,
  `msg_ans_wrong` text,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `ar_image_ans_correct` text,
  `ar_video_ans_correct` text,
  `accimg_ans_correct` text,
  `ar_image_ans_wrong` text,
  `ar_video_ans_wrong` text,
  `accimg_ans_wrong` text,
  PRIMARY KEY (`quiz_question_id`),
  KEY `quiz_id` (`quiz_id`),
  KEY `IDX_QQSTN_QNO` (`question_no`),
  CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table quiz_responses
# ------------------------------------------------------------

CREATE TABLE `quiz_responses` (
  `quiz_response_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `response` longtext NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`quiz_response_id`),
  KEY `user_id` (`user_id`),
  KEY `quiz_id` (`quiz_id`),
  CONSTRAINT `quiz_responses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `quiz_responses_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table quiz_survey_questions
# ------------------------------------------------------------

CREATE TABLE `quiz_survey_questions` (
  `quiz_survey_question_id` int NOT NULL AUTO_INCREMENT,
  `quiz_survey_id` int NOT NULL,
  `question_no` int DEFAULT NULL,
  `question` text NOT NULL,
  `option_a` text NOT NULL,
  `option_b` text NOT NULL,
  `option_c` text,
  `option_d` text,
  `type` enum('MCQ','MRQ','DRAW','TEXT') NOT NULL DEFAULT 'MRQ',
  `question_image` text,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `option_e` text,
  PRIMARY KEY (`quiz_survey_question_id`),
  KEY `quiz_survey_id` (`quiz_survey_id`),
  KEY `IDX_QSQSTN_QNO` (`question_no`),
  CONSTRAINT `quiz_survey_questions_ibfk_1` FOREIGN KEY (`quiz_survey_id`) REFERENCES `quiz_surveys` (`quiz_survey_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table quiz_survey_responses
# ------------------------------------------------------------

CREATE TABLE `quiz_survey_responses` (
  `quiz_response_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `quiz_survey_id` int NOT NULL,
  `response` longtext NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`quiz_response_id`),
  KEY `FK_QSRES_USRID` (`user_id`),
  KEY `FK_QSRES_QSID` (`quiz_survey_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table quiz_surveys
# ------------------------------------------------------------

CREATE TABLE `quiz_surveys` (
  `quiz_survey_id` int NOT NULL AUTO_INCREMENT,
  `no_of_questions` int NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'ADMIN',
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`quiz_survey_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table reflective_quiz_questions
# ------------------------------------------------------------

CREATE TABLE `reflective_quiz_questions` (
  `reflective_quiz_question_id` int NOT NULL AUTO_INCREMENT,
  `video_id` int NOT NULL,
  `question_no` int DEFAULT NULL,
  `question` text NOT NULL,
  `option_a` text,
  `option_b` text,
  `option_c` text,
  `option_d` text,
  `correct_ans` text,
  `level` enum('HARD','MEDIUM','EASY') NOT NULL DEFAULT 'HARD',
  `type` enum('MCQ','MRQ','DRAW','TEXT') NOT NULL DEFAULT 'MRQ',
  `redirect_to` int DEFAULT NULL,
  `question_image` text,
  `msg_ans_correct` text,
  `msg_ans_wrong` text,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`reflective_quiz_question_id`),
  KEY `FK_RQQSTN_VDEOID` (`video_id`),
  KEY `IDX_RQQSTN_QNO` (`question_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table reflective_quiz_questions_bk
# ------------------------------------------------------------

CREATE TABLE `reflective_quiz_questions_bk` (
  `reflective_quiz_question_id` int NOT NULL DEFAULT '0',
  `video_id` int NOT NULL,
  `question_no` int DEFAULT NULL,
  `question` text NOT NULL,
  `option_a` text,
  `option_b` text,
  `option_c` text,
  `option_d` text,
  `correct_ans` text,
  `level` enum('HARD','MEDIUM','EASY') NOT NULL DEFAULT 'HARD',
  `type` enum('MCQ','MRQ','DRAW','TEXT') NOT NULL DEFAULT 'MRQ',
  `redirect_to` int DEFAULT NULL,
  `question_image` text,
  `msg_ans_correct` text,
  `msg_ans_wrong` text,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table reflective_quiz_responses
# ------------------------------------------------------------

CREATE TABLE `reflective_quiz_responses` (
  `reflective_quiz_response_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  `response` longtext NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`reflective_quiz_response_id`),
  KEY `FK_RQRES_USRID` (`user_id`),
  KEY `FK_RQRES_VIDID` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table SequelizeMeta
# ------------------------------------------------------------

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;



# Dump of table students
# ------------------------------------------------------------

CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `team_id` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `institute_name` varchar(255) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `UUID` varchar(255) DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `Grade` varchar(255) DEFAULT NULL,
  `Gender` enum('FEMALE','MALE','OTHERS') DEFAULT NULL,
  `badges` longtext,
  PRIMARY KEY (`student_id`),
  KEY `user_id` (`user_id`),
  KEY `FK_STU_TEAMID` (`team_id`),
  KEY `IDX_STU_DSTRCT` (`district`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `CK_students` CHECK ((not((`full_name` like _utf8mb4'%[^a-zA-Z0-9 ]%'))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table support_tickets
# ------------------------------------------------------------

CREATE TABLE `support_tickets` (
  `support_ticket_id` int NOT NULL AUTO_INCREMENT,
  `query_category` varchar(255) NOT NULL,
  `query_details` longtext NOT NULL,
  `status` enum('OPEN','INPROGRESS','RESOLVED','BLOCKED') DEFAULT 'OPEN',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`support_ticket_id`),
  KEY `IDX_SUPTKT_CAT` (`query_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table support_tickets_replies
# ------------------------------------------------------------

CREATE TABLE `support_tickets_replies` (
  `support_tickets_reply_id` int NOT NULL AUTO_INCREMENT,
  `support_ticket_id` varchar(255) NOT NULL,
  `reply_details` longtext NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `query_id` int DEFAULT NULL,
  PRIMARY KEY (`support_tickets_reply_id`),
  KEY `query_id` (`query_id`),
  KEY `FK_STREPLY_STID` (`support_ticket_id`),
  CONSTRAINT `support_tickets_replies_ibfk_1` FOREIGN KEY (`query_id`) REFERENCES `support_tickets` (`support_ticket_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table supported_languages
# ------------------------------------------------------------

CREATE TABLE `supported_languages` (
  `supported_language_id` int NOT NULL AUTO_INCREMENT,
  `locale` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`supported_language_id`),
  UNIQUE KEY `locale` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table teams
# ------------------------------------------------------------

CREATE TABLE `teams` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `team_name` varchar(255) NOT NULL,
  `mentor_id` int DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`team_id`),
  KEY `FK_TEAMS_MENTID` (`team_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table translations
# ------------------------------------------------------------

CREATE TABLE `translations` (
  `translation_id` int NOT NULL AUTO_INCREMENT,
  `from_locale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `to_locale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`translation_id`),
  KEY `IDX_TRNSL_TLOCALE` (`to_locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table translations1_old
# ------------------------------------------------------------

CREATE TABLE `translations1_old` (
  `translation_id` int NOT NULL DEFAULT '0',
  `from_locale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `to_locale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table translations2
# ------------------------------------------------------------

CREATE TABLE `translations2` (
  `translation_id` int NOT NULL DEFAULT '0',
  `from_locale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `to_locale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`translation_id`),
  KEY `IDX_TRNSL_TLOCALE` (`to_locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table tutorial_videos
# ------------------------------------------------------------

CREATE TABLE `tutorial_videos` (
  `tutorial_video_id` int NOT NULL AUTO_INCREMENT,
  `video_stream_id` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `desc` longtext,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `type` enum('ALL','MENTOR','STUDENT') DEFAULT 'ALL',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`tutorial_video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table user_topic_progress
# ------------------------------------------------------------

CREATE TABLE `user_topic_progress` (
  `user_topic_progress_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_topic_id` int NOT NULL,
  `status` enum('COMPLETED','INCOMPLETE') DEFAULT 'INCOMPLETE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_topic_progress_id`),
  KEY `user_id` (`user_id`),
  KEY `course_topic_id` (`course_topic_id`),
  CONSTRAINT `user_topic_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `user_topic_progress_ibfk_2` FOREIGN KEY (`course_topic_id`) REFERENCES `course_topics` (`course_topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table users
# ------------------------------------------------------------

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `role` enum('ADMIN','evaluator','MENTOR','STUDENT') DEFAULT 'ADMIN',
  `is_loggedin` enum('YES','NO') DEFAULT 'NO',
  `last_login` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `IDX_USR_UN` (`username`),
  KEY `UNQ_USR_USRNAME` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table users_bk
# ------------------------------------------------------------

CREATE TABLE `users_bk` (
  `user_id` int NOT NULL DEFAULT '0',
  `username` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `role` enum('ADMIN','evaluator','MENTOR','STUDENT') DEFAULT 'ADMIN',
  `is_loggedin` enum('YES','NO') DEFAULT 'NO',
  `last_login` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table videos
# ------------------------------------------------------------

CREATE TABLE `videos` (
  `video_id` int NOT NULL AUTO_INCREMENT,
  `video_stream_id` varchar(255) NOT NULL,
  `video_duration` varchar(255) NOT NULL DEFAULT '-1',
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`video_id`),
  UNIQUE KEY `video_stream_id` (`video_stream_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table worksheet_responses
# ------------------------------------------------------------

CREATE TABLE `worksheet_responses` (
  `worksheet_response_id` int NOT NULL AUTO_INCREMENT,
  `worksheet_id` int NOT NULL,
  `user_id` int NOT NULL,
  `attachments` longtext NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`worksheet_response_id`),
  KEY `FK_WSRES_WSID` (`worksheet_id`),
  KEY `FK_WSRES_USRID` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table worksheets
# ------------------------------------------------------------

CREATE TABLE `worksheets` (
  `worksheet_id` int NOT NULL AUTO_INCREMENT,
  `description` longtext,
  `attachments` longtext NOT NULL,
  `status` enum('ACTIVE','INACTIVE','DELETED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`worksheet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET CHECKS = 1
