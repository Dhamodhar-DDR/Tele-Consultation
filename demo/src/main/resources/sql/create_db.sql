CREATE TABLE `Patient` (
	`patient_id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`mobile_number` VARCHAR(255) NOT NULL,
	`age` INT NOT NULL,
	`gender` VARCHAR(255) NOT NULL,
	`consent` BOOLEAN NOT NULL,
	`email` VARCHAR(255),
	`profile_pic` MEDIUMBLOB ,
	PRIMARY KEY (`patient_id`)
);

CREATE TABLE `Doctor` (
	`doctor_id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`mobile_number` VARCHAR(255) NOT NULL UNIQUE,
	`online_status` BOOLEAN NOT NULL,
	`age` INT NOT NULL,
	`experience` VARCHAR(255),
	`specialization` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255),
	`profile_pic` MEDIUMBLOB ,
	PRIMARY KEY (`doctor_id`)
);

CREATE TABLE `Appointment` (
	`appointment_id` INT NOT NULL AUTO_INCREMENT,
	`booking_time` TIMESTAMP NOT NULL,
	`patient_id` INT NOT NULL,
	`doctor_id` INT NOT NULL,
	`start_time` TIMESTAMP,
	`end_time` TIMESTAMP,
	`is_followup` BOOLEAN NOT NULL,
	`mark_for_followup` BOOLEAN NOT NULL,
	`status` VARCHAR(255) NOT NULL,
	`description` VARCHAR(255),
	`followup_reason` TEXT,
	PRIMARY KEY (`appointment_id`)
);

CREATE TABLE `Health_Record` (
	`hr_id` INT NOT NULL AUTO_INCREMENT,
	`patient_id` INT NOT NULL,
	`app_id` INT,
	`name` VARCHAR(255) NOT NULL,
	`description` VARCHAR(255),
	`file` MEDIUMBLOB  NOT NULL,
	PRIMARY KEY (`hr_id`)
);

CREATE TABLE `Prescription` (
	`pres_id` INT NOT NULL AUTO_INCREMENT,
	`app_id` INT NOT NULL,
	`med_name` VARCHAR(255) NOT NULL,
	`quantity` VARCHAR(255) NOT NULL,
	`description` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`pres_id`)
);

ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_fk0` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`);

ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_fk1` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`);

ALTER TABLE `Health_Record` ADD CONSTRAINT `Health_Record_fk0` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`);

ALTER TABLE `Health_Record` ADD CONSTRAINT `Health_Record_fk1` FOREIGN KEY (`app_id`) REFERENCES `Appointment`(`appointment_id`);

ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_fk0` FOREIGN KEY (`app_id`) REFERENCES `Appointment`(`appointment_id`);