# 📚 Hướng dẫn tạo dữ liệu điểm danh và kết nối với Render

Hướng dẫn chi tiết cách thiết lập hệ thống điểm danh và triển khai lên nền tảng Render.

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cài đặt Local](#cài-đặt-local)
3. [Cấu trúc Database](#cấu-trúc-database)
4. [Tạo dữ liệu điểm danh](#tạo-dữ-liệu-điểm-danh)
5. [Triển khai lên Render](#triển-khai-lên-render)
6. [Cập nhật Frontend](#cập-nhật-frontend)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan

Hệ thống điểm danh bao gồm:
- **Backend API**: Server Node.js/Express với PostgreSQL
- **Frontend**: Trang web quản lý điểm danh
- **Database**: PostgreSQL lưu trữ dữ liệu

### Cấu trúc dữ liệu:
- **Users**: Người dùng/giáo viên
- **Classes**: Lớp học
- **Students**: Học sinh
- **Sessions**: Buổi học
- **Attendance**: Điểm danh

---

## 💻 Cài đặt Local

### Bước 1: Cài đặt Dependencies

```bash
npm install
```

Lệnh này sẽ cài đặt:
- `express`: Web server
- `pg`: PostgreSQL client
- `cors`: CORS middleware
- `dotenv`: Environment variables

### Bước 2: Cài đặt PostgreSQL Local (tùy chọn)

Nếu muốn test local, cài PostgreSQL:

**Windows:**
- Tải từ: https://www.postgresql.org/download/windows/
- Hoặc dùng Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Bước 3: Tạo file `.env`

Tạo file `.env` trong thư mục gốc:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/attendance_db
PORT=3001
NODE_ENV=development
```

### Bước 4: Tạo Database và Tables

**Option 1: Dùng script tự động (khuyến nghị)**

```bash
# Tạo database và tables
npm run init-db

# Tạo database + dữ liệu mẫu
npm run init-db:seed
```

**Option 2: Dùng SQL file thủ công**

1. Tạo database:
```sql
CREATE DATABASE attendance_db;
```

2. Chạy file schema:
```bash
psql -U username -d attendance_db -f database/schema.sql
```

3. (Tùy chọn) Thêm dữ liệu mẫu:
```bash
psql -U username -d attendance_db -f database/seed.sql
```

### Bước 5: Chạy Server

```bash
# Chạy backend server
npm run dev:server

# Hoặc chạy cả frontend và backend
npm run dev:all
```

Server sẽ chạy tại: `http://localhost:3001`

### Bước 6: Test API

Mở browser và truy cập:
- Health check: `http://localhost:3001/api/health`
- Danh sách lớp: `http://localhost:3001/api/classes`

---

## 🗄️ Cấu trúc Database

### Bảng `users`
Quản lý người dùng đăng nhập:
- `id`: ID tự động
- `username`: Tên đăng nhập (unique)
- `password`: Mật khẩu (chưa mã hóa - nên cải thiện)
- `name`: Tên hiển thị
- `role`: Vai trò (admin, teacher)

### Bảng `classes`
Quản lý lớp học:
- `id`: ID tự động
- `name`: Tên lớp
- `description`: Mô tả

### Bảng `students`
Quản lý học sinh:
- `id`: ID tự động
- `name`: Họ tên
- `student_code`: Mã học sinh (unique)
- `class_id`: ID lớp học (foreign key)
- `email`: Email
- `phone`: Số điện thoại

### Bảng `sessions`
Quản lý buổi học:
- `id`: ID tự động
- `class_id`: ID lớp học (foreign key)
- `date`: Ngày học
- `topic`: Chủ đề
- `notes`: Ghi chú

### Bảng `attendance`
Quản lý điểm danh:
- `id`: ID tự động
- `session_id`: ID buổi học (foreign key)
- `student_id`: ID học sinh (foreign key)
- `status`: Trạng thái (present, absent, late, excused)
- `notes`: Ghi chú

---

## 📝 Tạo dữ liệu điểm danh

### Cách 1: Qua giao diện Web (Khuyến nghị)

1. **Đăng nhập**: Truy cập `diemdanh.html`
   - Username: `BTC_THU DUYEN`
   - Password: `ysof2025`

2. **Thêm lớp học**:
   - Tab "Lớp học" → Click "Thêm lớp mới"
   - Điền tên lớp và mô tả

3. **Thêm học sinh**:
   - Tab "Học sinh" → Chọn lớp → "Thêm học sinh mới"
   - Điền thông tin học sinh

4. **Tạo buổi học**:
   - Tab "Buổi học" → "Thêm buổi học"
   - Chọn lớp, ngày, chủ đề

5. **Điểm danh**:
   - Tab "Điểm danh" → Chọn buổi học
   - Chọn trạng thái cho từng học sinh
   - Click "Lưu điểm danh"

### Cách 2: Qua SQL Script

Chỉnh sửa file `database/seed.sql` với dữ liệu của bạn:

```sql
-- Thêm lớp học
INSERT INTO classes (name, description) VALUES
('Lớp Toán 10A', 'Lớp học Toán cơ bản lớp 10'),
('Lớp Lý 11B', 'Lớp học Vật Lý lớp 11');

-- Thêm học sinh
INSERT INTO students (name, student_code, class_id, email, phone) VALUES
('Nguyễn Văn A', 'HS001', 1, 'nguyenvana@example.com', '0123456789'),
('Trần Thị B', 'HS002', 1, 'tranthib@example.com', '0123456790');

-- Thêm buổi học
INSERT INTO sessions (class_id, date, topic, notes) VALUES
(1, '2025-01-15', 'Chương 1: Hàm số', 'Buổi học đầu tiên');

-- Thêm điểm danh
INSERT INTO attendance (session_id, student_id, status, notes) VALUES
(1, 1, 'present', ''),
(1, 2, 'late', 'Đến muộn 10 phút');
```

Chạy:
```bash
psql -U username -d attendance_db -f database/seed.sql
```

### Cách 3: Qua API

**Tạo lớp học:**
```bash
curl -X POST http://localhost:3001/api/classes \
  -H "Content-Type: application/json" \
  -d '{"name": "Lớp Toán 10A", "description": "Mô tả lớp"}'
```

**Tạo học sinh:**
```bash
curl -X POST http://localhost:3001/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "student_code": "HS001",
    "class_id": 1,
    "email": "email@example.com",
    "phone": "0123456789"
  }'
```

**Tạo buổi học:**
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": 1,
    "date": "2025-01-15",
    "topic": "Chương 1: Hàm số",
    "notes": "Ghi chú"
  }'
```

**Ghi điểm danh:**
```bash
curl -X POST http://localhost:3001/api/attendance/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "attendance_list": [
      {"student_id": 1, "status": "present", "notes": ""},
      {"student_id": 2, "status": "late", "notes": "Muộn 10 phút"}
    ]
  }'
```

---

## 🚀 Triển khai lên Render

### Bước 1: Tạo tài khoản Render

1. Truy cập: https://render.com
2. Đăng ký/Đăng nhập bằng GitHub

### Bước 2: Tạo PostgreSQL Database

1. Trong Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Đặt tên: `attendance-db` (hoặc tên bạn muốn)
3. Chọn Plan: **Free** (cho testing)
4. Chọn Region gần bạn nhất
5. Click **"Create Database"**
6. Đợi database được tạo (khoảng 1-2 phút)
7. Copy **Internal Database URL** hoặc **External Database URL**

### Bước 3: Tạo Web Service (Backend API)

1. Trong Render Dashboard, click **"New +"** → **"Web Service"**
2. Kết nối repository GitHub của bạn
3. Cấu hình:
   - **Name**: `attendance-api` (hoặc tên bạn muốn)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**:
   Thêm biến môi trường:
   ```
   DATABASE_URL = [Paste Internal Database URL từ bước 2]
   NODE_ENV = production
   PORT = 10000
   ```
   ⚠️ **Lưu ý**: Render tự động set PORT, nhưng nên set PORT=10000 để chắc chắn

5. Click **"Create Web Service"**
6. Đợi build và deploy (khoảng 3-5 phút)

### Bước 4: Khởi tạo Database trên Render

Sau khi backend đã deploy xong:

**Option 1: Dùng Render Shell (Khuyến nghị)**

1. Vào Web Service vừa tạo
2. Click tab **"Shell"**
3. Chạy lệnh:
```bash
node database/init.js
```
4. (Tùy chọn) Thêm dữ liệu mẫu:
```bash
node database/init.js --seed
```

**Option 2: Dùng PostgreSQL Client**

1. Lấy **External Database URL** từ Render
2. Cài đặt `psql` hoặc dùng client như DBeaver, pgAdmin
3. Chạy:
```bash
psql [External Database URL] -f database/schema.sql
```

**Option 3: Qua API (Nếu đã có endpoint init)**

Tạo endpoint khởi tạo trong `server.js` (chỉ dùng 1 lần):

```javascript
app.post('/api/init', async (req, res) => {
  // Chạy schema.sql
  // Chỉ nên chạy 1 lần khi setup
});
```

### Bước 5: Lấy URL của API

Sau khi deploy xong, bạn sẽ có URL như:
```
https://attendance-api.onrender.com
```

URL API sẽ là:
```
https://attendance-api.onrender.com/api
```

Lưu lại URL này để cập nhật vào frontend.

---

## 🔧 Cập nhật Frontend

### Bước 1: Cập nhật API URL trong JavaScript

Mở các file:
- `js/diemdanh.js`
- `js/diemdanh-dashboard.js`
- `diemdanh-dashboard.html`

Tìm và thay đổi:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : 'https://your-api-name.onrender.com/api'; // ← Thay bằng URL Render của bạn
```

Thành:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : 'https://attendance-api.onrender.com/api'; // ← URL thực tế của bạn
```

### Bước 2: Deploy Frontend

**Option 1: Deploy lên Render Static Site**

1. Trong Render Dashboard, click **"New +"** → **"Static Site"**
2. Kết nối repository
3. Cấu hình:
   - **Build Command**: (để trống hoặc `echo "No build needed"`)
   - **Publish Directory**: `/` (root)
4. Click **"Create Static Site"**

**Option 2: Deploy lên GitHub Pages**

1. Push code lên GitHub
2. Vào Settings → Pages
3. Chọn branch `main` và folder `/root`
4. Lưu và truy cập URL được cung cấp

**Option 3: Deploy lên Netlify/Vercel**

Tương tự như Render Static Site.

---

## 🔍 Testing sau khi Deploy

### 1. Test API Health

Truy cập: `https://your-api.onrender.com/api/health`

Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Server và database hoạt động bình thường"
}
```

### 2. Test Đăng nhập

1. Truy cập trang điểm danh
2. Đăng nhập với:
   - Username: `BTC_THU DUYEN`
   - Password: `ysof2025`

### 3. Test CRUD Operations

- Tạo lớp học mới
- Thêm học sinh
- Tạo buổi học
- Ghi điểm danh

---

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to database"

**Nguyên nhân**: DATABASE_URL không đúng hoặc database chưa sẵn sàng

**Giải pháp**:
1. Kiểm tra Environment Variables trong Render
2. Đảm bảo dùng **Internal Database URL** (không phải External)
3. Đợi database khởi động xong (khoảng 1-2 phút sau khi tạo)

### Lỗi: "relation does not exist"

**Nguyên nhân**: Chưa chạy schema.sql

**Giải pháp**:
```bash
# Qua Render Shell
node database/init.js
```

### Lỗi: CORS Error

**Nguyên nhân**: Frontend và Backend khác domain

**Giải pháp**: Đã cấu hình CORS trong `server.js`, nhưng nếu vẫn lỗi, thêm vào `server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
```

### Lỗi: "Service Unavailable" sau 15 phút

**Nguyên nhân**: Render Free tier tự động sleep sau 15 phút không có traffic

**Giải pháp**:
1. Upgrade lên paid plan ($7/tháng)
2. Hoặc dùng service ping tự động để keep-alive:
   - https://uptimerobot.com
   - Ping URL mỗi 5 phút

### Lỗi: "Port already in use"

**Nguyên nhân**: PORT đã được sử dụng

**Giải pháp**: Render tự động set PORT, không cần config trong code. Nhưng nếu cần:

```javascript
const PORT = process.env.PORT || 3001;
```

---

## 📊 Quản lý dữ liệu

### Xem dữ liệu qua Render Dashboard

1. Vào PostgreSQL database
2. Click tab **"Connect"**
3. Copy connection string và dùng với pgAdmin hoặc DBeaver

### Backup Database

Render tự động backup hàng ngày. Để backup thủ công:

```bash
pg_dump [DATABASE_URL] > backup.sql
```

### Restore Database

```bash
psql [DATABASE_URL] < backup.sql
```

---

## 🔐 Bảo mật

### Cải thiện bảo mật (Quan trọng!)

1. **Mã hóa mật khẩu**:
   - Cài `bcrypt`: `npm install bcrypt`
   - Hash password khi lưu vào database

2. **JWT Authentication**:
   - Thêm JWT cho authentication thay vì lưu password trong localStorage

3. **API Rate Limiting**:
   - Thêm rate limiting để tránh abuse

4. **Input Validation**:
   - Validate và sanitize input

5. **HTTPS**:
   - Render tự động có HTTPS (miễn phí)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Render Dashboard
2. Kiểm tra console trong browser
3. Test API endpoints trực tiếp

---

## ✅ Checklist triển khai

- [ ] Đã tạo PostgreSQL database trên Render
- [ ] Đã tạo Web Service backend
- [ ] Đã set Environment Variables
- [ ] Đã deploy backend thành công
- [ ] Đã chạy `schema.sql` để tạo tables
- [ ] Đã test API health check
- [ ] Đã cập nhật API_URL trong frontend
- [ ] Đã deploy frontend
- [ ] Đã test đăng nhập
- [ ] Đã test tạo dữ liệu điểm danh

---

**Chúc bạn triển khai thành công! 🎉**

