-- MySQL Script generated by MySQL Workbench
-- Tue Apr 20 19:03:41 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema asa
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema asa
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `asa` DEFAULT CHARACTER SET utf8 ;
USE `asa` ;

-- -----------------------------------------------------
-- Table `asa`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`user` ;

CREATE TABLE IF NOT EXISTS `asa`.`user` (
  `uid` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(60) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `fname` VARCHAR(45) NOT NULL,
  `lname` VARCHAR(45) NOT NULL,
  `role` ENUM('student', 'instructor', 'admin') NOT NULL DEFAULT 'student',
  `created` DATETIME NOT NULL DEFAULT now(),
  PRIMARY KEY (`uid`, `email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asa`.`student`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`student` ;

CREATE TABLE IF NOT EXISTS `asa`.`student` (
  `sid` INT NOT NULL AUTO_INCREMENT,
  `user_uid` INT NOT NULL,
  `major` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`sid`, `user_uid`),
  INDEX `fk_student_user1_idx` (`user_uid` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asa`.`instructor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`instructor` ;

CREATE TABLE IF NOT EXISTS `asa`.`instructor` (
  `inst_id` INT NOT NULL AUTO_INCREMENT,
  `user_uid` INT NOT NULL,
  `rank` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`inst_id`, `user_uid`),
  INDEX `fk_instructor_user1_idx` (`user_uid` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asa`.`course`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`course` ;

CREATE TABLE IF NOT EXISTS `asa`.`course` (
  `cid` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `courseCode` VARCHAR(4) NOT NULL,
  PRIMARY KEY (`cid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asa`.`project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`project` ;

CREATE TABLE IF NOT EXISTS `asa`.`project` (
  `pid` INT NOT NULL AUTO_INCREMENT,
  `owner` VARCHAR(45) NOT NULL,
  `projCode` VARCHAR(10) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `course` VARCHAR(45) NOT NULL,
  `semester` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`pid`, `owner`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asa`.`work_session`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`work_session` ;

CREATE TABLE IF NOT EXISTS `asa`.`work_session` (
  `wid` INT NOT NULL AUTO_INCREMENT,
  `project_pid` INT NOT NULL,
  `student_sid` INT NOT NULL,
  `student_user_uid` INT NOT NULL,
  `owner` VARCHAR(60) NOT NULL,
  `project` VARCHAR(45) NOT NULL,
  `date` DATETIME NOT NULL,
  `startHr` INT NOT NULL,
  `startMin` INT NOT NULL,
  `finishHr` INT NOT NULL,
  `finishMin` INT NOT NULL,
  `code` ENUM('10', '20', '30', '40', '50', '60', '70', '80', '90') NOT NULL DEFAULT '10',
  `code90Desc` VARCHAR(60) NOT NULL,
  `description` VARCHAR(280) NOT NULL,
  PRIMARY KEY (`wid`, `project_pid`, `student_sid`, `student_user_uid`),
  INDEX `fk_work_session_project1_idx` (`project_pid` ASC) VISIBLE,
  INDEX `fk_work_session_student1_idx` (`student_sid` ASC, `student_user_uid` ASC) VISIBLE,
  UNIQUE INDEX `owner_UNIQUE` (`owner` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asa`.`course_offering`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`course_offering` ;

CREATE TABLE IF NOT EXISTS `asa`.`course_offering` (
  `instructor_inst_id` INT NOT NULL,
  `instructor_user_uid` INT NOT NULL,
  `course_cid` INT NOT NULL,
  PRIMARY KEY (`instructor_inst_id`, `instructor_user_uid`, `course_cid`),
  INDEX `fk_instructor_has_course_course1_idx` (`course_cid` ASC) VISIBLE,
  INDEX `fk_instructor_has_course_instructor1_idx` (`instructor_inst_id` ASC, `instructor_user_uid` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asa`.`project_has_course_offering`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`project_has_course_offering` ;

CREATE TABLE IF NOT EXISTS `asa`.`project_has_course_offering` (
  `project_pid` INT NOT NULL,
  `course_offering_instructor_inst_id` INT NOT NULL,
  `course_offering_instructor_user_uid` INT NOT NULL,
  `course_offering_course_cid` INT NOT NULL,
  PRIMARY KEY (`project_pid`, `course_offering_instructor_inst_id`, `course_offering_instructor_user_uid`, `course_offering_course_cid`),
  INDEX `fk_project_has_course_offering_course_offering1_idx` (`course_offering_instructor_inst_id` ASC, `course_offering_instructor_user_uid` ASC, `course_offering_course_cid` ASC) VISIBLE,
  INDEX `fk_project_has_course_offering_project1_idx` (`project_pid` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asa`.`works-on`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `asa`.`works-on` ;

CREATE TABLE IF NOT EXISTS `asa`.`works-on` (
  `student_sid` INT NOT NULL,
  `student_user_uid` INT NOT NULL,
  `project_pid` INT NOT NULL,
  `project_owner` VARCHAR(45) NOT NULL,
  `semester` CHAR(4) NOT NULL,
  PRIMARY KEY (`student_sid`, `student_user_uid`, `project_pid`, `project_owner`),
  INDEX `fk_student_has_project_project1_idx` (`project_pid` ASC, `project_owner` ASC) VISIBLE,
  INDEX `fk_student_has_project_student1_idx` (`student_sid` ASC, `student_user_uid` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
