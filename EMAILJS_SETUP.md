# Hướng dẫn thiết lập EmailJS để gửi email từ form liên hệ

## Bước 1: Đăng ký tài khoản EmailJS
1. Truy cập [EmailJS.com](https://www.emailjs.com/)
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

## Bước 2: Tạo Email Service
1. Vào **Email Services** trong dashboard
2. Chọn **Add New Service**
3. Chọn **Gmail** (hoặc email provider khác)
4. Đăng nhập với email của bạn (Dynnmath@gmail.com)
5. Lưu lại **Service ID**

## Bước 3: Tạo Email Template
1. Vào **Email Templates** trong dashboard
2. Chọn **Create New Template**
3. Thiết lập template như sau:

**Subject:**
```
Tin nhắn mới từ website: {{subject}}
```

**Content:**
```html
<h2>Tin nhắn mới từ website</h2>

<p><strong>Tên:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Tiêu đề:</strong> {{subject}}</p>
<p><strong>Nội dung:</strong></p>
<p>{{message}}</p>

<hr>
<p><em>Tin nhắn được gửi từ form liên hệ website THU DUYÊN</em></p>
```

4. Lưu lại **Template ID**

## Bước 4: Lấy Public Key
1. Vào **Account** → **API Keys**
2. Copy **Public Key**

## Bước 5: Cập nhật code
Thay thế các giá trị sau trong file `js/main.js`:

```javascript
// Thay thế YOUR_PUBLIC_KEY
emailjs.init("YOUR_PUBLIC_KEY");

// Thay thế YOUR_SERVICE_ID
'YOUR_SERVICE_ID'

// Thay thế YOUR_TEMPLATE_ID  
'YOUR_TEMPLATE_ID'
```

## Ví dụ hoàn chỉnh:
```javascript
emailjs.init("user_abc123def456");

const response = await emailjs.send(
    'service_xyz789', 
    'template_uvw012',
    templateParams
);
```

## Bước 6: Kiểm tra
1. Mở website
2. Điền form liên hệ
3. Gửi tin nhắn
4. Kiểm tra email của bạn

## Lưu ý:
- EmailJS miễn phí cho 200 email/tháng
- Đảm bảo email service được kết nối đúng
- Template có thể tùy chỉnh theo ý muốn
- Có thể thêm các trường thông tin khác nếu cần

## Hỗ trợ:
Nếu gặp vấn đề, hãy kiểm tra:
- Console browser để xem lỗi
- EmailJS dashboard để xem logs
- Đảm bảo tất cả ID đã được thay thế đúng
