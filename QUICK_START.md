# ⚡ Quick Start Guide - Điểm danh & Render

Hướng dẫn nhanh để bắt đầu với hệ thống điểm danh.

## 🚀 Bước nhanh

### 1. Cài đặt Local (5 phút)

```bash
# Cài dependencies
npm install

# Tạo file .env
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/attendance_db" > .env
echo "PORT=3001" >> .env
echo "NODE_ENV=development" >> .env

# Khởi tạo database (nếu có PostgreSQL local)
npm run init-db:seed

# Chạy server
npm run dev:server
```

### 2. Deploy lên Render (10 phút)

1. **Tạo PostgreSQL Database trên Render**
   - New + → PostgreSQL
   - Copy Internal Database URL

2. **Tạo Web Service**
   - New + → Web Service
   - Connect GitHub repo
   - Build: `npm install`
   - Start: `npm start`
   - Environment Variables:
     ```
     DATABASE_URL = [Internal Database URL]
     NODE_ENV = production
     PORT = 10000
     ```

3. **Khởi tạo Database**
   - Vào Shell của Web Service
   - Chạy: `node database/init.js`

4. **Cập nhật Frontend**
   - Mở `js/diemdanh.js` và `js/diemdanh-dashboard.js`
   - Thay `your-api-name.onrender.com` bằng URL thực tế của bạn

### 3. Sử dụng

- **Đăng nhập**: 
  - Username: `BTC_THU DUYEN`
  - Password: `ysof2025`

- **Tạo dữ liệu**:
  1. Tab "Lớp học" → Thêm lớp
  2. Tab "Học sinh" → Thêm học sinh
  3. Tab "Buổi học" → Thêm buổi học
  4. Tab "Điểm danh" → Chọn buổi học → Ghi điểm danh

## 📚 Tài liệu đầy đủ

Xem file `HUONG_DAN_RENDER.md` để biết chi tiết.

## 🔗 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - Đăng nhập
- `GET /api/classes` - Danh sách lớp
- `POST /api/classes` - Tạo lớp
- `GET /api/students` - Danh sách học sinh
- `POST /api/students` - Tạo học sinh
- `GET /api/sessions` - Danh sách buổi học
- `POST /api/sessions` - Tạo buổi học
- `POST /api/attendance/bulk` - Ghi điểm danh hàng loạt

## 🆘 Vấn đề thường gặp

**Database chưa tạo tables?**
```bash
node database/init.js
```

**CORS error?**
Đã config trong server.js, kiểm tra lại URL.

**API không kết nối?**
Kiểm tra DATABASE_URL trong Environment Variables.

