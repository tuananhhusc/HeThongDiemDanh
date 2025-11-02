// API Base URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : 'https://he-thong-diem-danh98.vercel.app/api'; // Thay bằng URL Render của bạn

// Global state
let classes = [];
let sessions = [];
let students = [];
let currentSessionId = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  loadData();
  setupModals();
  setupEventListeners();
});

// ========== TABS ==========
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      
      // Update buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update contents
      tabContents.forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${tabId}`).classList.add('active');
      
      // Load data for active tab
      if (tabId === 'sessions') loadSessions();
      if (tabId === 'students') loadStudents();
    });
  });
}

// ========== DATA LOADING ==========
async function loadData() {
  await Promise.all([
    loadClasses(),
    loadSessions(),
    loadStudents()
  ]);
}

async function loadClasses() {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`);
    const result = await response.json();
    
    if (result.success) {
      classes = result.data;
      renderClasses();
      updateClassSelects();
    }
  } catch (error) {
    console.error('Lỗi tải lớp học:', error);
    showNotification('Không thể tải danh sách lớp học', 'error');
  }
}

async function loadSessions() {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`);
    const result = await response.json();
    
    if (result.success) {
      sessions = result.data;
      renderSessions();
      updateSessionSelects();
    }
  } catch (error) {
    console.error('Lỗi tải buổi học:', error);
    showNotification('Không thể tải danh sách buổi học', 'error');
  }
}

async function loadStudents(classId = null) {
  try {
    let url = `${API_BASE_URL}/classes/${classId || classes[0]?.id || ''}/students`;
    if (!classId && classes.length > 0) {
      url = `${API_BASE_URL}/classes/${classes[0].id}/students`;
    }
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      students = result.data;
      renderStudents();
    }
  } catch (error) {
    console.error('Lỗi tải học sinh:', error);
    showNotification('Không thể tải danh sách học sinh', 'error');
  }
}

// ========== RENDERING ==========
function renderClasses() {
  const container = document.getElementById('classesList');
  if (!container) return;
  
  if (classes.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Chưa có lớp học nào. Hãy thêm lớp mới!</p>';
    return;
  }
  
  container.innerHTML = classes.map(cls => `
    <div class="class-card">
      <h3>${escapeHtml(cls.name)}</h3>
      <p>${escapeHtml(cls.description || 'Không có mô tả')}</p>
      <div class="card-actions">
        <button class="btn btn-sm btn-primary" onclick="editClass(${cls.id})">Sửa</button>
        <button class="btn btn-sm btn-danger" onclick="deleteClass(${cls.id})">Xóa</button>
      </div>
    </div>
  `).join('');
}

function renderSessions() {
  const container = document.getElementById('sessionsList');
  const filterClass = document.getElementById('filterClassSession')?.value;
  
  if (!container) return;
  
  let filteredSessions = sessions;
  if (filterClass) {
    filteredSessions = sessions.filter(s => s.class_id == filterClass);
  }
  
  if (filteredSessions.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Chưa có buổi học nào.</p>';
    return;
  }
  
  container.innerHTML = filteredSessions.map(session => `
    <div class="session-card">
      <div class="session-header">
        <h3>${escapeHtml(session.class_name || 'N/A')}</h3>
        <span class="session-date">${formatDate(session.date)}</span>
      </div>
      <p class="session-topic">${escapeHtml(session.topic || 'Không có chủ đề')}</p>
      <div class="card-actions">
        <button class="btn btn-sm btn-primary" onclick="viewAttendance(${session.id})">Điểm danh</button>
        <button class="btn btn-sm btn-secondary" onclick="editSession(${session.id})">Sửa</button>
      </div>
    </div>
  `).join('');
}

function renderStudents() {
  const tbody = document.getElementById('studentsTableBody');
  const filterClass = document.getElementById('filterClassStudent')?.value;
  
  if (!tbody) return;
  
  let filteredStudents = students;
  // Filter logic sẽ được thêm vào sau
  
  if (filteredStudents.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">Chưa có học sinh nào.</td></tr>';
    return;
  }
  
  tbody.innerHTML = filteredStudents.map(student => `
    <tr>
      <td>${escapeHtml(student.student_code || 'N/A')}</td>
      <td>${escapeHtml(student.name)}</td>
      <td>${escapeHtml(getClassName(student.class_id))}</td>
      <td>${escapeHtml(student.email || '-')}</td>
      <td>${escapeHtml(student.phone || '-')}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editStudent(${student.id})">Sửa</button>
        <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

async function renderAttendance(sessionId) {
  const container = document.getElementById('attendanceContent');
  if (!container) return;
  
  try {
    // Load students for this session's class
    const session = sessions.find(s => s.id == sessionId);
    if (!session) return;
    
    await loadStudents(session.class_id);
    
    // Load attendance records
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/attendance`);
    const result = await response.json();
    
    const attendanceRecords = result.success ? result.data : [];
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      attendanceMap[record.student_id] = record;
    });
    
    container.innerHTML = `
      <div class="attendance-header">
        <h3>Điểm danh: ${escapeHtml(session.class_name)} - ${formatDate(session.date)}</h3>
        <button class="btn btn-primary" onclick="saveAttendance(${sessionId})"><i class="fas fa-save"></i> Lưu điểm danh</button>
      </div>
      <div class="attendance-table-container">
        <table class="attendance-table">
          <thead>
            <tr>
              <th>Mã HS</th>
              <th>Họ tên</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(student => {
              const record = attendanceMap[student.id];
              return `
                <tr>
                  <td>${escapeHtml(student.student_code || 'N/A')}</td>
                  <td>${escapeHtml(student.name)}</td>
                  <td>
                    <select class="attendance-status" data-student-id="${student.id}">
                      <option value="present" ${record?.status === 'present' ? 'selected' : ''}>Có mặt</option>
                      <option value="absent" ${record?.status === 'absent' ? 'selected' : ''}>Vắng</option>
                      <option value="late" ${record?.status === 'late' ? 'selected' : ''}>Muộn</option>
                      <option value="excused" ${record?.status === 'excused' ? 'selected' : ''}>Có phép</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" class="attendance-notes" data-student-id="${student.id}" 
                           value="${escapeHtml(record?.notes || '')}" placeholder="Ghi chú">
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    currentSessionId = sessionId;
  } catch (error) {
    console.error('Lỗi tải điểm danh:', error);
    showNotification('Không thể tải dữ liệu điểm danh', 'error');
  }
}

// ========== HELPER FUNCTIONS ==========
function updateClassSelects() {
  const selects = document.querySelectorAll('#filterClassSession, #filterClassStudent, #sessionClassId, #studentClassId');
  selects.forEach(select => {
    const currentValue = select.value;
    select.innerHTML = '<option value="">Tất cả lớp</option>' + 
      classes.map(cls => `<option value="${cls.id}">${escapeHtml(cls.name)}</option>`).join('');
    if (currentValue) select.value = currentValue;
  });
}

function updateSessionSelects() {
  const select = document.getElementById('filterSessionAttendance');
  if (!select) return;
  
  select.innerHTML = '<option value="">Chọn buổi học</option>' +
    sessions.map(s => `<option value="${s.id}">${escapeHtml(s.class_name || 'N/A')} - ${formatDate(s.date)}</option>`).join('');
}

function getClassName(classId) {
  const cls = classes.find(c => c.id == classId);
  return cls ? cls.name : 'N/A';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  // Simple notification - có thể thay bằng thư viện như toastr
  alert(message);
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'diemdanh.html';
  });
  
  // Filter sessions
  document.getElementById('filterClassSession')?.addEventListener('change', renderSessions);
  
  // Filter students
  document.getElementById('filterClassStudent')?.addEventListener('change', (e) => {
    loadStudents(e.target.value || null);
  });
  
  // Filter attendance
  document.getElementById('filterSessionAttendance')?.addEventListener('change', (e) => {
    if (e.target.value) {
      renderAttendance(parseInt(e.target.value));
    }
  });
  
  // Add buttons
  document.getElementById('addClassBtn')?.addEventListener('click', () => {
    document.getElementById('classId').value = '';
    document.getElementById('className').value = '';
    document.getElementById('classDescription').value = '';
    document.getElementById('classModalTitle').textContent = 'Thêm lớp học mới';
    document.getElementById('classModal').style.display = 'block';
  });
  
  document.getElementById('addSessionBtn')?.addEventListener('click', () => {
    document.getElementById('sessionId').value = '';
    document.getElementById('sessionDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('sessionTopic').value = '';
    document.getElementById('sessionNotes').value = '';
    document.getElementById('sessionModalTitle').textContent = 'Thêm buổi học mới';
    updateClassSelects();
    document.getElementById('sessionModal').style.display = 'block';
  });
  
  document.getElementById('addStudentBtn')?.addEventListener('click', () => {
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('studentCode').value = '';
    document.getElementById('studentEmail').value = '';
    document.getElementById('studentPhone').value = '';
    document.getElementById('studentModalTitle').textContent = 'Thêm học sinh mới';
    updateClassSelects();
    document.getElementById('studentModal').style.display = 'block';
  });
}

// ========== MODAL FUNCTIONS ==========
function setupModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    closeBtn?.addEventListener('click', () => modal.style.display = 'none');
    cancelBtn?.addEventListener('click', () => modal.style.display = 'none');
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });
  
  // Form submissions
  document.getElementById('classForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveClass();
  });
  
  document.getElementById('sessionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSession();
  });
  
  document.getElementById('studentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveStudent();
  });
}

// ========== CRUD OPERATIONS ==========
async function saveClass() {
  const id = document.getElementById('classId').value;
  const name = document.getElementById('className').value;
  const description = document.getElementById('classDescription').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    
    const result = await response.json();
    if (result.success) {
      showNotification('Lưu lớp học thành công!', 'success');
      document.getElementById('classModal').style.display = 'none';
      await loadClasses();
    } else {
      showNotification(result.message || 'Lỗi khi lưu lớp học', 'error');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    showNotification('Không thể kết nối đến server', 'error');
  }
}

async function saveSession() {
  const class_id = document.getElementById('sessionClassId').value;
  const date = document.getElementById('sessionDate').value;
  const topic = document.getElementById('sessionTopic').value;
  const notes = document.getElementById('sessionNotes').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id, date, topic, notes })
    });
    
    const result = await response.json();
    if (result.success) {
      showNotification('Lưu buổi học thành công!', 'success');
      document.getElementById('sessionModal').style.display = 'none';
      await loadSessions();
    } else {
      showNotification(result.message || 'Lỗi khi lưu buổi học', 'error');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    showNotification('Không thể kết nối đến server', 'error');
  }
}

async function saveStudent() {
  const name = document.getElementById('studentName').value;
  const student_code = document.getElementById('studentCode').value;
  const class_id = document.getElementById('studentClassId').value;
  const email = document.getElementById('studentEmail').value;
  const phone = document.getElementById('studentPhone').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, student_code, class_id, email, phone })
    });
    
    const result = await response.json();
    if (result.success) {
      showNotification('Lưu học sinh thành công!', 'success');
      document.getElementById('studentModal').style.display = 'none';
      await loadStudents(class_id);
    } else {
      showNotification(result.message || 'Lỗi khi lưu học sinh', 'error');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    showNotification('Không thể kết nối đến server', 'error');
  }
}

async function saveAttendance(sessionId) {
  const statusSelects = document.querySelectorAll('.attendance-status');
  const notesInputs = document.querySelectorAll('.attendance-notes');
  
  const attendanceList = [];
  statusSelects.forEach(select => {
    const studentId = select.dataset.studentId;
    const status = select.value;
    const notesInput = Array.from(notesInputs).find(input => input.dataset.studentId === studentId);
    const notes = notesInput ? notesInput.value : '';
    
    attendanceList.push({ student_id: parseInt(studentId), status, notes });
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        attendance_list: attendanceList
      })
    });
    
    const result = await response.json();
    if (result.success) {
      showNotification('Lưu điểm danh thành công!', 'success');
      await renderAttendance(sessionId);
    } else {
      showNotification(result.message || 'Lỗi khi lưu điểm danh', 'error');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    showNotification('Không thể kết nối đến server', 'error');
  }
}

// ========== ACTION FUNCTIONS ==========
function editClass(id) {
  const cls = classes.find(c => c.id === id);
  if (!cls) return;
  
  document.getElementById('classId').value = cls.id;
  document.getElementById('className').value = cls.name;
  document.getElementById('classDescription').value = cls.description || '';
  document.getElementById('classModalTitle').textContent = 'Sửa lớp học';
  document.getElementById('classModal').style.display = 'block';
}

function editSession(id) {
  const session = sessions.find(s => s.id === id);
  if (!session) return;
  
  document.getElementById('sessionId').value = session.id;
  document.getElementById('sessionClassId').value = session.class_id;
  document.getElementById('sessionDate').value = session.date;
  document.getElementById('sessionTopic').value = session.topic || '';
  document.getElementById('sessionNotes').value = session.notes || '';
  document.getElementById('sessionModalTitle').textContent = 'Sửa buổi học';
  updateClassSelects();
  document.getElementById('sessionModal').style.display = 'block';
}

function editStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  
  document.getElementById('studentId').value = student.id;
  document.getElementById('studentName').value = student.name;
  document.getElementById('studentCode').value = student.student_code || '';
  document.getElementById('studentClassId').value = student.class_id;
  document.getElementById('studentEmail').value = student.email || '';
  document.getElementById('studentPhone').value = student.phone || '';
  document.getElementById('studentModalTitle').textContent = 'Sửa học sinh';
  updateClassSelects();
  document.getElementById('studentModal').style.display = 'block';
}

function viewAttendance(sessionId) {
  // Switch to attendance tab
  document.querySelector('[data-tab="attendance"]').click();
  // Load attendance
  setTimeout(() => {
    document.getElementById('filterSessionAttendance').value = sessionId;
    renderAttendance(sessionId);
  }, 100);
}

function deleteClass(id) {
  if (!confirm('Bạn có chắc muốn xóa lớp học này?')) return;
  // TODO: Implement delete API
  showNotification('Tính năng xóa đang được phát triển', 'info');
}

function deleteStudent(id) {
  if (!confirm('Bạn có chắc muốn xóa học sinh này?')) return;
  // TODO: Implement delete API
  showNotification('Tính năng xóa đang được phát triển', 'info');
}

// Export functions to global scope
window.editClass = editClass;
window.deleteClass = deleteClass;
window.editSession = editSession;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.viewAttendance = viewAttendance;
window.saveAttendance = saveAttendance;


