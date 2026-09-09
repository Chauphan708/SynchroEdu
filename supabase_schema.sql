-- ==============================================================================
-- CƠ SỞ DỮ LIỆU CHUẨN HÓA: SYNCHROEDU (SUPABASE / POSTGRESQL)
-- Hệ thống Quản trị Sinh hoạt Chuyên môn Số & Báo cáo Ma trận 2D Cấp Tiểu Học
-- ==============================================================================

-- 1. BẢNG CỤM CHUYÊN MÔN LIÊN TRƯỜNG (CLUSTERS)
CREATE TABLE IF NOT EXISTS clusters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    district VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    lead_school_id INT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG TRƯỜNG HỌC (SCHOOLS - HỖ TRỢ ĐA TRƯỜNG MULTI-TENANT)
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    cluster_id INT REFERENCES clusters(id) ON DELETE SET NULL,
    name VARCHAR(250) NOT NULL,
    short_name VARCHAR(50),
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    logo_url TEXT,
    principal_name VARCHAR(100),
    settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG PHÂN HIỆU / ĐIỂM TRƯỜNG (BRANCHES)
CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    distance_from_center_km NUMERIC(5,2) DEFAULT 0,
    vice_principal_in_charge_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_school_branch UNIQUE (school_id, code)
);

-- 4. BẢNG TỔ CHUYÊN MÔN (DEPARTMENTS)
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL,
    grade_level INT,
    head_id INT,
    deputy_id INT,
    is_delegated BOOLEAN DEFAULT FALSE,
    delegated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_school_dept UNIQUE (school_id, name)
);

-- 5. BẢNG NGƯỜI DÙNG & GIÁO VIÊN (USERS)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    branch_id INT REFERENCES branches(id) ON DELETE SET NULL,
    dept_id INT REFERENCES departments(id) ON DELETE SET NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) NOT NULL CHECK (role IN (
        'PRINCIPAL',
        'VICE_PRINCIPAL',
        'HEAD_DEPT',
        'DEPUTY_HEAD',
        'TEACHER',
        'GUEST_CLUSTER'
    )),
    assigned_class VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG BÁO CÁO TUẦN (WEEKLY REPORTS - 1 NGUỒN NHẬP, 2 LUỒNG PHÂN PHỐI)
CREATE TABLE IF NOT EXISTS weekly_reports (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    branch_id INT REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
    dept_id INT REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    week_number INT NOT NULL,
    academic_year VARCHAR(20) DEFAULT '2026-2027',

    -- Tab 1: Chuyên Môn (Luồng Ngang)
    subject VARCHAR(100) NOT NULL,
    curriculum_progress VARCHAR(30) DEFAULT 'ON_TRACK' CHECK (curriculum_progress IN ('ON_TRACK', 'DELAYED', 'AHEAD')),
    delay_reason TEXT,
    remedial_students_count INT DEFAULT 0,
    remedial_students_detail TEXT,

    -- Tab 2: Cơ Sở Vật Chất (Luồng Dọc)
    facility_status VARCHAR(20) DEFAULT 'NORMAL' CHECK (facility_status IN ('NORMAL', 'DEFECT', 'URGENT', 'EMERGENCY')),
    facility_issue_description TEXT,
    facility_image_url TEXT,
    facility_resolved BOOLEAN DEFAULT FALSE,
    facility_resolution_notes TEXT,

    -- Tab 3: Phản Ánh & Kiến Nghị
    suggestions TEXT,

    -- Trạng thái nộp & Theo dõi trễ hạn
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    deadline TIMESTAMPTZ NOT NULL,
    is_late BOOLEAN DEFAULT FALSE,
    late_duration_minutes INT DEFAULT 0,
    late_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_week UNIQUE (user_id, week_number, academic_year)
);

-- 7. BẢNG CHIẾN DỊCH THU THẬP DỮ LIỆU ĐỘT XUẤT (DATA REQUESTS - REQ)
CREATE TABLE IF NOT EXISTS data_requests (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(250) NOT NULL,
    description TEXT,
    target_scope VARCHAR(30) DEFAULT 'ALL_CLASSES',
    deadline TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BẢNG PHẢN HỒI THU THẬP ĐỘT XUẤT (STUDENT SUBMISSIONS)
CREATE TABLE IF NOT EXISTS student_submissions (
    id SERIAL PRIMARY KEY,
    request_id INT REFERENCES data_requests(id) ON DELETE CASCADE NOT NULL,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    has_target_students BOOLEAN DEFAULT FALSE,
    students_list JSONB DEFAULT '[]'::jsonb,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    response_time_seconds INT DEFAULT 30,
    CONSTRAINT unique_request_class UNIQUE (request_id, class_name)
);

-- 9. BẢNG KHO HỌC LIỆU SỐ DÙNG CHUNG (RESOURCE HUB - 13 MÔN & BUỔI 2)
CREATE TABLE IF NOT EXISTS resource_hub (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    author_id INT REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    subject VARCHAR(100) NOT NULL,
    grade_level INT NOT NULL,
    title VARCHAR(250) NOT NULL,
    description TEXT,
    learning_outcomes TEXT,
    resource_type VARCHAR(50) NOT NULL,
    tt27_difficulty_level INT CHECK (tt27_difficulty_level IN (1, 2, 3)),
    file_url TEXT,
    google_drive_preview_url TEXT,
    download_format VARCHAR(20) DEFAULT 'DOCX',
    is_cluster_shared BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by INT REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rating_average NUMERIC(3,2) DEFAULT 5.0,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BẢNG NGHIÊN CỨU BÀI HỌC & BIÊN BẢN SHCM (MEETING MINUTES & LESSON STUDY)
CREATE TABLE IF NOT EXISTS meeting_minutes (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    dept_id INT REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(250) NOT NULL,
    meeting_type VARCHAR(50) DEFAULT 'LESSON_STUDY',
    meeting_date DATE NOT NULL,
    chairperson_id INT REFERENCES users(id) NOT NULL,
    secretary_id INT REFERENCES users(id) NOT NULL,
    is_delegated_chair BOOLEAN DEFAULT FALSE,
    step_1_plan_content TEXT,
    step_2_observation_content TEXT,
    step_3_discussion_content TEXT,
    step_4_application_content TEXT,
    student_evidence_photos JSONB DEFAULT '[]'::jsonb,
    ai_summary TEXT,
    full_content TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED_BGH', 'APPROVED_BGH')),
    bgh_notes TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BẢNG THÔNG BÁO TỨC THÌ ĐA CẤP (NOTIFICATIONS - <1 GIÂY)
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
    sender_id INT REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    scope VARCHAR(30) NOT NULL CHECK (scope IN ('ALL_SCHOOL', 'BRANCH', 'DEPARTMENT', 'DIRECT')),
    target_branch_id INT REFERENCES branches(id) ON DELETE CASCADE,
    target_dept_id INT REFERENCES departments(id) ON DELETE CASCADE,
    target_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    urgency VARCHAR(20) DEFAULT 'NORMAL' CHECK (urgency IN ('NORMAL', 'HIGH', 'EMERGENCY', 'FLASH')),
    requires_ack BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BẢNG THEO DÕI ĐÃ ĐỌC / XÁC NHẬN THÔNG BÁO (NOTIFICATION READS)
CREATE TABLE IF NOT EXISTS notification_reads (
    id SERIAL PRIMARY KEY,
    notification_id INT REFERENCES notifications(id) ON DELETE CASCADE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMPTZ,
    CONSTRAINT unique_user_notification UNIQUE (notification_id, user_id)
);

-- ==============================================================================
-- CÁC TRIGGER TỰ ĐỘNG HÓA (TRIGGERS & BUSINESS LOGIC)
-- ==============================================================================

CREATE OR REPLACE FUNCTION calc_late_submission()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.submitted_at > NEW.deadline THEN
        NEW.is_late := TRUE;
        NEW.late_duration_minutes := EXTRACT(EPOCH FROM (NEW.submitted_at - NEW.deadline)) / 60;
    ELSE
        NEW.is_late := FALSE;
        NEW.late_duration_minutes := 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calc_late_submission ON weekly_reports;
CREATE TRIGGER trg_calc_late_submission
BEFORE INSERT OR UPDATE ON weekly_reports
FOR EACH ROW EXECUTE FUNCTION calc_late_submission();

CREATE OR REPLACE FUNCTION populate_notification_reads()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.scope = 'ALL_SCHOOL' THEN
        INSERT INTO notification_reads (notification_id, user_id)
        SELECT NEW.id, u.id FROM users u WHERE u.school_id = NEW.school_id AND u.id != NEW.sender_id;
    ELSIF NEW.scope = 'BRANCH' THEN
        INSERT INTO notification_reads (notification_id, user_id)
        SELECT NEW.id, u.id FROM users u WHERE u.branch_id = NEW.target_branch_id AND u.id != NEW.sender_id;
    ELSIF NEW.scope = 'DEPARTMENT' THEN
        INSERT INTO notification_reads (notification_id, user_id)
        SELECT NEW.id, u.id FROM users u WHERE u.dept_id = NEW.target_dept_id AND u.id != NEW.sender_id;
    ELSIF NEW.scope = 'DIRECT' AND NEW.target_user_id IS NOT NULL THEN
        INSERT INTO notification_reads (notification_id, user_id)
        VALUES (NEW.id, NEW.target_user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_populate_notification_reads ON notifications;
CREATE TRIGGER trg_populate_notification_reads
AFTER INSERT ON notifications
FOR EACH ROW EXECUTE FUNCTION populate_notification_reads();

-- ==============================================================================
-- CƠ SỞ DỮ LIỆU SẠCH (KHÔNG CHỨA DỮ LIỆU MẪU)
-- Dữ liệu trường học, giáo viên và báo cáo sẽ được khởi tạo thực tế khi sử dụng
-- ==============================================================================

-- ==============================================================================
-- BẢO MẬT DỮ LIỆU ĐA TRƯỜNG & ĐA PHÂN HIỆU (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_hub ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;

-- Policies cơ bản cho truy cập dữ liệu
CREATE POLICY "Cho phép truy cập kho học liệu cụm" ON resource_hub FOR ALL USING (true);
CREATE POLICY "Cho phép truy cập thông tin trường" ON schools FOR ALL USING (true);
CREATE POLICY "Cho phép truy cập thông tin phân hiệu" ON branches FOR ALL USING (true);
CREATE POLICY "Cho phép truy cập thông tin tổ chuyên môn" ON departments FOR ALL USING (true);
CREATE POLICY "Cho phép truy cập báo cáo theo trường" ON weekly_reports FOR ALL USING (true);

