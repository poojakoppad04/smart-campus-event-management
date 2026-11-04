USE smartcampuseventmanagement;

CREATE TABLE STUDENT (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_study TINYINT NOT NULL,
    CHECK (year_of_study BETWEEN 1 AND 4)
) ENGINE=InnoDB;

CREATE TABLE ORGANIZER (
    organizer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE VENUE (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    CHECK (capacity > 0)
) ENGINE=InnoDB;

CREATE TABLE EVENT (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    organizer_id INT NOT NULL,
    venue_id INT NOT NULL,
    max_participants INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Upcoming',

    CONSTRAINT fk_event_organizer
        FOREIGN KEY (organizer_id)
        REFERENCES ORGANIZER(organizer_id),

    CONSTRAINT fk_event_venue
        FOREIGN KEY (venue_id)
        REFERENCES VENUE(venue_id),

    CHECK (max_participants > 0),
    CHECK (end_time > start_time),

    INDEX idx_event_date (event_date),
    INDEX idx_event_organizer (organizer_id),
    INDEX idx_event_venue (venue_id)
) ENGINE=InnoDB;

CREATE TABLE REGISTRATION (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'Registered',

    CONSTRAINT fk_registration_student
        FOREIGN KEY (student_id)
        REFERENCES STUDENT(student_id),

    CONSTRAINT fk_registration_event
        FOREIGN KEY (event_id)
        REFERENCES EVENT(event_id),

    CONSTRAINT uq_student_event
        UNIQUE (student_id, event_id),

    INDEX idx_registration_event_status (event_id, status),
    INDEX idx_registration_date (registration_date)
) ENGINE=InnoDB;

CREATE TABLE FEEDBACK (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    rating TINYINT NOT NULL,
    comments TEXT,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_feedback_student
        FOREIGN KEY (student_id)
        REFERENCES STUDENT(student_id),

    CONSTRAINT fk_feedback_event
        FOREIGN KEY (event_id)
        REFERENCES EVENT(event_id),

    CONSTRAINT uq_feedback_student_event
        UNIQUE (student_id, event_id),

    CHECK (rating BETWEEN 1 AND 5),

    INDEX idx_feedback_event (event_id),
    INDEX idx_feedback_date (feedback_date)
) ENGINE=InnoDB;
