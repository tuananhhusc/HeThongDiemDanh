# ✅ CHECKLIST - Những việc bạn cần làm

## 🚀 Bước 1: Đẩy code lên GitHub

```bash
git add .
git commit -m "Add attendance system with Render deployment"
git push origin main
```

## 🚀 Bước 2: Tạo Database trên Render (2 phút)

1. Vào https://render.com → Đăng nhập
2. Click **"New +"** → **"PostgreSQL"**
3. Đặt tên: `attendance-db`
4. Chọn **Free** plan
5. Click **"Create Database"**
6. ⚠️ **QUAN TRỌNG**: Đợi database tạo xong (1-2 phút)
7. Vào database → Tab **"Connect"** → Copy **"Internal Database URL"**

   Format sẽ như: `postgresql://user:pass@host/dbname`

## 🚀 Bước 3: Tạo Backend API trên Render (3 phút)

1. Trong Render Dashboard → Click **"New +"** → **"Web Service"**
2. Kết nối GitHub repository của bạn
3. Điền thông tin:
   - **Name**: `attendance-api` (hoặc tên bạn muốn)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. ⚠️ **Environment Variables** - Thêm 3 biến:
   ```
   DATABASE_URL = [Paste Internal Database URL từ bước 2]
   NODE_ENV = production
   PORT = 10000
   ```

5. Click **"Create Web Service"**
6. Đợi build xong (3-5 phút)

## 🚀 Bước 4: Khởi tạo Database (1 phút)

1. Sau khi backend deploy xong → Vào Web Service
2. Click tab **"Shell"**
3. Chạy lệnh:
   ```bash
   node database/init.js
   ```
4. Đợi xong, sẽ thấy: `✅ Đã tạo các bảng thành công!`

## 🚀 Bước 5: Lấy URL API và cập nhật Frontend (2 phút)

1. **Lấy URL API**:
   - Vào Web Service của bạn trên Render
   - Copy URL (ví dụ: `https://attendance-api.onrender.com`)
   - URL API sẽ là: `https://attendance-api.onrender.com/api`

2. **Cập nhật 3 file JavaScript**:
   
   **File 1**: `js/diemdanh.js` (dòng 11)
   ```javascript
   : 'https://attendance-api.onrender.com/api'; // ← Thay URL của bạn
   ```
   
   **File 2**: `js/diemdanh-dashboard.js` (dòng 4)
   ```javascript
   : 'https://attendance-api.onrender.com/api'; // ← Thay URL của bạn
   ```
   
   **File 3**: `diemdanh-dashboard.html` (dòng 216)
   ```javascript
   : 'https://attendance-api.onrender.com/api'; // ← Thay URL của bạn
   ```

3. **Commit và push lại**:
   ```bash
   git add js/diemdanh.js js/diemdanh-dashboard.js diemdanh-dashboard.html
   git commit -m "Update API URL for Render"
   git push origin main
   ```

## 🚀 Bước 6: Deploy Frontend (tùy chọn)

Nếu bạn muốn deploy frontend lên Render Static Site:

1. Render Dashboard → **"New +"** → **"Static Site"**
2. Connect GitHub repo
3. **Build Command**: (để trống)
4. **Publish Directory**: `/` (root)
5. Click **"Create Static Site"**

Hoặc bạn có thể dùng GitHub Pages, Netlify, Vercel...

## ✅ Kiểm tra cuối cùng

1. ✅ Test API Health: Truy cập `https://your-api.onrender.com/api/health`
   - Phải thấy: `{"success":true,"message":"Server và database hoạt động bình thường"}`

2. ✅ Test đăng nhập:
   - Username: `BTC_THU DUYEN`
   - Password: `ysof2025`

3. ✅ Test tạo dữ liệu:
   - Thêm lớp học
   - Thêm học sinh
   - Tạo buổi học
   - Ghi điểm danh

## 🆘 Nếu gặp lỗi

**Lỗi: "Cannot connect to database"**
- Kiểm tra lại DATABASE_URL trong Environment Variables
- Đảm bảo dùng **Internal Database URL** (không phải External)

**Lỗi: "relation does not exist"**
- Quên chạy `node database/init.js` trong Shell
- Chạy lại lệnh này

**CORS Error**
- Kiểm tra API URL trong frontend đã đúng chưa
- Đảm bảo URL không có lỗi typo

---

## 📝 Tóm tắt: Bạn chỉ cần làm 6 bước trên!

Mọi thứ khác đã được setup sẵn:
- ✅ Backend server (`server.js`)
- ✅ Database schema (`database/schema.sql`)
- ✅ Frontend dashboard (`diemdanh-dashboard.html`)
- ✅ API endpoints
- ✅ Authentication
- ✅ CRUD operations

**Chúc bạn deploy thành công! 🎉**

