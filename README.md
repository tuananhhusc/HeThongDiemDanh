# Kristina - Personal Portfolio Website

Một website portfolio cá nhân hiện đại và responsive, được thiết kế dựa trên mẫu Kristina từ Webflow. Website này phù hợp cho các designer, developer, freelancer và chuyên gia sáng tạo.

## ✨ Tính năng

- **Design hiện đại**: Giao diện đẹp mắt với gradient colors và typography chuyên nghiệp
- **Responsive**: Tối ưu cho mọi thiết bị (desktop, tablet, mobile)
- **Animations**: Hiệu ứng mượt mà với AOS (Animate On Scroll)
- **Portfolio filtering**: Lọc dự án theo danh mục
- **Contact form**: Form liên hệ với validation
- **Blog section**: Hiển thị bài viết blog
- **Skills visualization**: Thanh kỹ năng với animation
- **Mobile navigation**: Menu hamburger cho mobile
- **Smooth scrolling**: Cuộn mượt giữa các section

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd kristina-personal-website
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Chạy website
```bash
npm run dev
```

Website sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu trúc dự án

```
kristina-personal-website/
├── index.html          # Trang chủ chính
├── css/
│   └── style.css      # CSS chính
├── js/
│   └── main.js        # JavaScript chính
├── images/             # Thư mục hình ảnh
├── package.json        # Dependencies và scripts
└── README.md           # Hướng dẫn sử dụng
```

## 🎨 Tùy chỉnh

### Thay đổi thông tin cá nhân
1. Mở file `index.html`
2. Thay đổi nội dung trong các section:
   - Hero section: Tên, chức danh, mô tả
   - About section: Thông tin giới thiệu và kỹ năng
   - Portfolio section: Dự án và công việc
   - Blog section: Bài viết blog
   - Contact section: Thông tin liên hệ

### Thay đổi màu sắc
1. Mở file `css/style.css`
2. Tìm và thay đổi các biến màu:
   ```css
   /* Primary colors */
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   
   /* Text colors */
   color: #333; /* Main text */
   color: #666; /* Secondary text */
   ```

### Thay đổi hình ảnh
1. Thêm hình ảnh vào thư mục `images/`
2. Cập nhật đường dẫn trong `index.html`
3. Xem `images/README.md` để biết chi tiết về hình ảnh cần thiết

## 📱 Responsive Design

Website được thiết kế responsive với các breakpoints:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🌟 Tính năng nâng cao

### Portfolio Filtering
- Lọc dự án theo danh mục (Web Design, App Design, Branding)
- Animation mượt mà khi chuyển đổi

### Contact Form
- Validation form đầy đủ
- Notification system
- Responsive design

### Animations
- Scroll-triggered animations
- Hover effects
- Loading animations
- Smooth transitions

## 🔧 Dependencies

- **AOS**: Animate On Scroll library
- **Font Awesome**: Icons
- **Google Fonts**: Typography (Inter)
- **Live Server**: Development server

## 📝 License

MIT License - Bạn có thể sử dụng, chỉnh sửa và phân phối tự do.

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:
1. Fork dự án
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi:
- Tạo issue trên GitHub
- Liên hệ qua email: support@example.com

## 🎯 Roadmap

- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] CMS integration
- [ ] SEO optimization
- [ ] Performance improvements
- [ ] PWA features

---

**Made with ❤️ by [Your Name]**

Website này được tạo ra để giúp bạn xây dựng portfolio chuyên nghiệp và ấn tượng. Hãy tùy chỉnh theo phong cách và nhu cầu của bạn!
