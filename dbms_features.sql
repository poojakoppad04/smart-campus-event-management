USE smartcampuseventmanagement;

-- ==========================================
-- 1. VIEW: Event details with organizer/venue
-- ==========================================
CREATE OR REPLACE VIEW vw_event_details AS
SELECT
    e.event_id,
    e.title,
    e.description,
    e.event_date,
    e.start_time,
    e.end_time,
    e.max_participants,
    e.status,
    o.name AS organizer_name,
    v.venue_name,
    v.location AS venue_location,
    v.capacity AS venue_capacity
FROM EVENT e
JOIN ORGANIZER o ON e.organizer_id = o.organizer_id
JOIN VENUE v ON e.venue_id = v.venue_id;

-- ==========================================
-- 2. VIEW: Registration details
-- ==========================================
CREATE OR REPLACE VIEW vw_registration_details AS
SELECT
    r.registration_id,
    r.student_id,
    s.name AS student_name,
    s.email AS student_email,
    r.event_id,
    e.title AS event_title,
    r.registration_date,
    r.status
FROM REGISTRATION r
JOIN STUDENT s ON r.student_id = s.student_id
JOIN EVENT e ON r.event_id = e.event_id;

-- ==========================================
-- 3. FUNCTION: Count registrations
-- ==========================================
DROP FUNCTION IF EXISTS fn_event_registration_count;

DELIMITER $$

CREATE FUNCTION fn_event_registration_count(p_event_id INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE v_count INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_count
    FROM REGISTRATION
    WHERE event_id = p_event_id
      AND status = 'Registered';

    RETURN v_count;
END$$

-- ==========================================
-- 4. FUNCTION: Calculate available seats
-- ==========================================
CREATE FUNCTION fn_available_seats(p_event_id INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE v_capacity INT DEFAULT NULL;
    DECLARE v_registered INT DEFAULT 0;

    SELECT max_participants
    INTO v_capacity
    FROM EVENT
    WHERE event_id = p_event_id;

    IF v_capacity IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT COUNT(*)
    INTO v_registered
    FROM REGISTRATION
    WHERE event_id = p_event_id
      AND status = 'Registered';

    RETURN GREATEST(v_capacity - v_registered, 0);
END$$

-- ==========================================
-- 5. PROCEDURE: Get registrations for an event
-- ==========================================
CREATE PROCEDURE sp_get_event_registrations(
    IN p_event_id INT
)
BEGIN
    SELECT
        registration_id,
        student_id,
        student_name,
        student_email,
        event_id,
        event_title,
        registration_date,
        status
    FROM vw_registration_details
    WHERE event_id = p_event_id
    ORDER BY registration_date DESC;
END$$

-- ==========================================
-- 6. PROCEDURE: Get event summary
-- ==========================================
CREATE PROCEDURE sp_get_event_summary()
BEGIN
    SELECT
        event_id,
        title,
        event_date,
        status,
        max_participants,
        fn_event_registration_count(event_id) AS registered_count,
        fn_available_seats(event_id) AS available_seats
    FROM EVENT
    ORDER BY event_date, start_time;
END$$

-- ==========================================
-- 7. TRIGGER: Prevent event over-registration
-- ==========================================
CREATE TRIGGER trg_check_registration_capacity
BEFORE INSERT ON REGISTRATION
FOR EACH ROW
BEGIN
    DECLARE v_capacity INT;
    DECLARE v_status VARCHAR(30);
    DECLARE v_count INT;

    SELECT max_participants, status
    INTO v_capacity, v_status
    FROM EVENT
    WHERE event_id = NEW.event_id;

    SELECT COUNT(*)
    INTO v_count
    FROM REGISTRATION
    WHERE event_id = NEW.event_id
      AND status = 'Registered';

    IF v_status = 'Cancelled' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot register for a cancelled event';
    END IF;

    IF v_count >= v_capacity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Event registration capacity is full';
    END IF;
END$$

-- ==========================================
-- 8. TRIGGER: Protect existing registrations
-- ==========================================
CREATE TRIGGER trg_check_event_capacity_update
BEFORE UPDATE ON EVENT
FOR EACH ROW
BEGIN
    DECLARE v_count INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_count
    FROM REGISTRATION
    WHERE event_id = OLD.event_id
      AND status = 'Registered';

    IF NEW.max_participants < v_count THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Capacity cannot be lower than existing registrations';
    END IF;
END$$

DELIMITER ;
