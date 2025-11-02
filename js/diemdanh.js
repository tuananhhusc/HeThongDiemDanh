(function(){
  var form = document.getElementById('attendanceLogin');
  if(!form) return;
  var errorBox = document.getElementById('dd-error');
  var username = document.getElementById('dd-username');
  var password = document.getElementById('dd-password');

  // API Base URL - Thay đổi khi deploy lên Render
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : 'https://he-thong-diem-danh98.vercel.app/api'; // Thay bằng URL Render của bạn

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    errorBox.style.display = 'none';
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.value.trim(),
          password: password.value
        })
      });

      const data = await response.json();

      if (data.success) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        // Chuyển đến trang dashboard
        window.location.href = 'diemdanh-dashboard.html';
      } else {
        errorBox.textContent = data.message || 'Thông tin đăng nhập không đúng. Vui lòng thử lại.';
        errorBox.style.display = 'block';
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      errorBox.textContent = 'Không thể kết nối đến server. Vui lòng kiểm tra lại.';
      errorBox.style.display = 'block';
    }
  });
})();

