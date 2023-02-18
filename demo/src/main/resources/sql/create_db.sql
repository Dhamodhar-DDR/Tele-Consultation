CREATE TABLE `Patient` (
	`patient_id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`mobile_number` VARCHAR(255) NOT NULL,
	`age` INT NOT NULL,
	`gender` VARCHAR(255) NOT NULL,
	`consent` BOOLEAN NOT NULL,
	PRIMARY KEY (`patient_id`)
);

CREATE TABLE `Doctor` (
	`doctor_id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`mobile_number` VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY (`doctor_id`)
);

CREATE TABLE `Appointment` (
	`appointment_id` INT NOT NULL AUTO_INCREMENT,
	`patient_id` INT NOT NULL,
	`doctor_id` INT NOT NULL,
	`start_time` TIMESTAMP NOT NULL,
	`end_time` TIMESTAMP NOT NULL,
	`is_followup` BOOLEAN NOT NULL,
	`mark_for_followup` BOOLEAN NOT NULL,
	PRIMARY KEY (`appointment_id`)
);

CREATE TABLE `Health_Record` (
	`hr_id` INT NOT NULL AUTO_INCREMENT,
	`patient_id` INT NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`description` VARCHAR(255),
	PRIMARY KEY (`hr_id`)
);

CREATE TABLE `Prescription` (
	`app_id` INT NOT NULL,
	`med_name` VARCHAR(255) NOT NULL,
	`quantity` VARCHAR(255) NOT NULL,
	`description` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`app_id`)
);

ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_fk0` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`);

ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_fk1` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`);

ALTER TABLE `Health_Record` ADD CONSTRAINT `Health_Record_fk0` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`);

ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_fk0` FOREIGN KEY (`app_id`) REFERENCES `Appointment`(`appointment_id`);





