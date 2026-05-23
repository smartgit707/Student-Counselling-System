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
    dob DATE,
    streak_count INT DEFAULT 0,
    total_points INT DEFAULT 0,
    last_active_date DATE
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
    meet_link VARCHAR(200),
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
CREATE TABLE IF NOT EXISTS Daily_Mood_Tracker_V2 (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    sid INT NOT NULL,
    mood_score INT NOT NULL,
    notes VARCHAR(200),
    log_date DATE,
    FOREIGN KEY (sid) REFERENCES Student_V2(sid)
);
CREATE TABLE IF NOT EXISTS Counsellor_Feedback_V2 (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    aid INT NOT NULL,
    sid INT NOT NULL,
    cid INT NOT NULL,
    rating INT NOT NULL,
    comments VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aid) REFERENCES Appointment_V2(aid),
    FOREIGN KEY (sid) REFERENCES Student_V2(sid),
    FOREIGN KEY (cid) REFERENCES Counsellor_V2(cid)
);
CREATE TABLE IF NOT EXISTS Mental_Health_Resources_V2 (
    resource_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    content_text TEXT NOT NULL,
    author_cid INT NOT NULL,
    date_posted DATE,
    FOREIGN KEY (author_cid) REFERENCES Counsellor_V2(cid)
);
CREATE TABLE IF NOT EXISTS System_Notifications_V2 (
    nid INT PRIMARY KEY AUTO_INCREMENT,
    sid INT NOT NULL,
    message VARCHAR(200) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sid) REFERENCES Student_V2(sid)
);
-- =========================
-- ADVANCED FEATURES TABLES
-- =========================
CREATE TABLE IF NOT EXISTS Message_V2 (
    msg_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_type VARCHAR(20) NOT NULL, -- 'student' or 'counsellor'
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Emergency_Alert_V2 (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    sid INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Resolved'
    resolved_by INT,
    FOREIGN KEY (sid) REFERENCES Student_V2(sid),
    FOREIGN KEY (resolved_by) REFERENCES Counsellor_V2(cid)
);

CREATE TABLE IF NOT EXISTS Forum_Post_V2 (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    sid INT, -- Can be NULL for anonymous posts
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sid) REFERENCES Student_V2(sid)
);

CREATE TABLE IF NOT EXISTS Forum_Comment_V2 (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    sid INT, -- Can be NULL for anonymous
    cid INT, -- If counsellor replies
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Forum_Post_V2(post_id),
    FOREIGN KEY (sid) REFERENCES Student_V2(sid),
    FOREIGN KEY (cid) REFERENCES Counsellor_V2(cid)
);

CREATE TABLE IF NOT EXISTS Group_Session_V2 (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    cid INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    session_date DATE,
    session_time TIME,
    meet_link VARCHAR(200),
    max_participants INT DEFAULT 10,
    FOREIGN KEY (cid) REFERENCES Counsellor_V2(cid)
);

CREATE TABLE IF NOT EXISTS Group_Registration_V2 (
    reg_id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    sid INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES Group_Session_V2(session_id),
    FOREIGN KEY (sid) REFERENCES Student_V2(sid)
);

CREATE TABLE IF NOT EXISTS Waitlist_V2 (
    waitlist_id INT PRIMARY KEY AUTO_INCREMENT,
    sid INT NOT NULL,
    cid INT NOT NULL,
    request_date DATE,
    status VARCHAR(20) DEFAULT 'Waiting', -- 'Waiting', 'Notified', 'Booked'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sid) REFERENCES Student_V2(sid),
    FOREIGN KEY (cid) REFERENCES Counsellor_V2(cid)
);

CREATE TABLE IF NOT EXISTS Journal_Entry_V2 (
    entry_id INT PRIMARY KEY AUTO_INCREMENT,
    sid INT NOT NULL,
    title VARCHAR(100),
    content TEXT NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    ai_flag BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sid) REFERENCES Student_V2(sid)
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

INSERT IGNORE INTO Daily_Mood_Tracker_V2 (log_id, sid, mood_score, notes, log_date)
VALUES 
(1, 1, 7, 'Feeling slightly anxious about exams', '2026-04-19'),
(2, 1, 8, 'Meditation helped a lot today', '2026-04-20');

INSERT IGNORE INTO Counsellor_Feedback_V2 (feedback_id, aid, sid, cid, rating, comments)
VALUES 
(1, 1, 1, 1, 5, 'Dr. Meena was very understanding and gave great advice.');

INSERT IGNORE INTO Mental_Health_Resources_V2 (resource_id, title, content_text, author_cid, date_posted)
VALUES 
(1, '5 Ways to Manage Exam Stress', '1. Take breaks. 2. Sleep 8 hours. 3. Eat healthy. 4. Stay hydrated. 5. Talk to a friend.', 1, '2026-04-10'),
(2, 'Understanding Anxiety', 'Anxiety is a normal response to stress. However, if it affects your daily life, consider speaking to a counsellor.', 2, '2026-04-12');

INSERT IGNORE INTO System_Notifications_V2 (nid, sid, message, is_read)
VALUES 
(1, 1, 'Welcome to CampusCare! Take your first assessment today.', 0),
(2, 1, 'Reminder: You have an upcoming appointment with Dr. Meena.', 0);
