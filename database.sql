-- =========================
-- CREATE DATABASE
-- =========================
CREATE DATABASE IF NOT EXISTS Counselling_System_V2;
USE Counselling_System_V2;
-- =========================
-- CREATE TABLES
-- =========================
CREATE TABLE IF NOT EXISTS Student_V2 (
    sid INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    branch VARCHAR(30),
    year INT,
    email VARCHAR(50) UNIQUE,
    pass VARCHAR(20),
    phone VARCHAR(15),
    gender VARCHAR(10),
    dob DATE
);
CREATE TABLE IF NOT EXISTS Counsellor_V2 (
    cid INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    spec VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    phone VARCHAR(15),
    experience INT,
    available_from TIME,
    available_to TIME
);
CREATE TABLE IF NOT EXISTS Appointment_V2 (
    aid INT PRIMARY KEY AUTO_INCREMENT,
    sid INT NOT NULL,
    cid INT NOT NULL,
    adate DATE,
    atime TIME,
    mode VARCHAR(20),
    status VARCHAR(20),
    remarks VARCHAR(200),
    FOREIGN KEY (sid) REFERENCES Student_V2(sid),
    FOREIGN KEY (cid) REFERENCES Counsellor_V2(cid)
);
CREATE TABLE IF NOT EXISTS Assessment_V2 (
    asid INT PRIMARY KEY AUTO_INCREMENT,
    sid INT NOT NULL,
    test_date DATE,
    anxiety INT,
    depression INT,
    stress INT,
    level VARCHAR(20),
    suggestion VARCHAR(200),
    FOREIGN KEY (sid) REFERENCES Student_V2(sid)
);
CREATE TABLE IF NOT EXISTS Session_Record_V2 (
    rid INT PRIMARY KEY AUTO_INCREMENT,
    aid INT NOT NULL,
    notes VARCHAR(300),
    next_meeting DATE,
    FOREIGN KEY (aid) REFERENCES Appointment_V2(aid)
);
CREATE TABLE IF NOT EXISTS Admin_V2 (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) UNIQUE,
    password VARCHAR(30)
);
-- =========================
-- INSERT DATA (using IGNORE to prevent duplicates if run multiple times)
-- =========================
INSERT IGNORE INTO Student_V2 (sid, name, branch, year, email, pass, phone, gender, dob)
VALUES 
(1, 'Ved', 'CSE', 2, 'ved@gmail.com', 'ved123', '9876543210', 'Male', '2004-05-10'),
(2, 'Manmohan', 'IT', 3, 'manmohan@gmail.com', 'man123', '9123456780', 'Male', '2003-08-15');

INSERT IGNORE INTO Counsellor_V2 (cid, name, spec, email, phone, experience, available_from, available_to)
VALUES 
(1, 'Dr. Meena', 'Mental Health', 'meena@gmail.com', '9000000001', 8, '10:00:00', '16:00:00'),
(2, 'Dr. Roy', 'Stress Management', 'roy@gmail.com', '9000000002', 10, '11:00:00', '17:00:00');

INSERT IGNORE INTO Appointment_V2 (aid, sid, cid, adate, atime, mode, status, remarks)
VALUES 
(1, 1, 1, '2026-04-20', '10:30:00', 'Online', 'Scheduled', 'First session'),
(2, 2, 2, '2026-04-21', '12:00:00', 'Offline', 'Scheduled', 'Follow-up');

INSERT IGNORE INTO Assessment_V2 (asid, sid, test_date, anxiety, depression, stress, level, suggestion)
VALUES 
(1, 1, '2026-04-18', 5, 4, 6, 'Moderate', 'Practice meditation'),
(2, 2, '2026-04-18', 3, 2, 4, 'Low', 'Maintain routine');

INSERT IGNORE INTO Session_Record_V2 (rid, aid, notes, next_meeting)
VALUES 
(1, 1, 'Student showed mild anxiety', '2026-04-27'),
(2, 2, 'Improvement observed', '2026-04-28');

INSERT IGNORE INTO Admin_V2 (admin_id, username, password)
VALUES 
(1, 'admin1', 'admin123'),
(2, 'admin2', 'admin456');
