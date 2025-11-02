-- File seed data - Dữ liệu mẫu để test hệ thống
-- Chạy file này sau khi đã tạo schema để có dữ liệu mẫu

-- Thêm một số lớp học mẫu
INSERT INTO classes (name, description) VALUES
('Lớp Toán 10A', 'Lớp học Toán cơ bản lớp 10'),
('Lớp Lý 11B', 'Lớp học Vật Lý lớp 11'),
('Lớp Hóa 12C', 'Lớp học Hóa Học lớp 12')
ON CONFLICT DO NOTHING;

-- Thêm học sinh mẫu (giả sử class_id = 1)
INSERT INTO students (name, student_code, class_id, email, phone) VALUES
('Nguyễn Văn A', 'HS001', 1, 'nguyenvana@example.com', '0123456789'),
('Trần Thị B', 'HS002', 1, 'tranthib@example.com', '0123456790'),
('Lê Văn C', 'HS003', 1, 'levanc@example.com', '0123456791'),
('Phạm Thị D', 'HS004', 1, 'phamthid@example.com', '0123456792'),
('Hoàng Văn E', 'HS005', 1, 'hoangvane@example.com', '0123456793')
ON CONFLICT (student_code) DO NOTHING;

-- Thêm buổi học mẫu
INSERT INTO sessions (class_id, date, topic, notes) VALUES
(1, CURRENT_DATE - INTERVAL '7 days', 'Chương 1: Hàm số', 'Buổi học đầu tiên về hàm số'),
(1, CURRENT_DATE - INTERVAL '5 days', 'Chương 1: Đồ thị hàm số', 'Vẽ và phân tích đồ thị'),
(1, CURRENT_DATE - INTERVAL '3 days', 'Chương 2: Phương trình', 'Giải phương trình bậc nhất'),
(1, CURRENT_DATE - INTERVAL '1 day', 'Chương 2: Bất phương trình', 'Giải bất phương trình')
ON CONFLICT DO NOTHING;

-- Thêm điểm danh mẫu cho buổi học đầu tiên
INSERT INTO attendance (session_id, student_id, status, notes) VALUES
(1, 1, 'present', ''),
(1, 2, 'present', ''),
(1, 3, 'late', 'Đến muộn 10 phút'),
(1, 4, 'absent', 'Có phép'),
(1, 5, 'present', '')
ON CONFLICT (session_id, student_id) DO NOTHING;

