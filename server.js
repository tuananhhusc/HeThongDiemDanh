const express = require('express');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Đã kết nối với database');
});

pool.on('error', (err) => {
  console.error('❌ Lỗi kết nối database:', err);
});

// ========== AUTHENTICATION ==========
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Query user from database
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không đúng'
      });
    }
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// ========== CLASSES ==========
// Lấy danh sách lớp học
app.get('/api/classes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM classes ORDER BY name ASC'
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách lớp:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Tạo lớp học mới
app.post('/api/classes', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      'INSERT INTO classes (name, description, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, description]
    );
    res.json({
      success: true,
      message: 'Tạo lớp học thành công',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Lỗi tạo lớp học:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// ========== STUDENTS ==========
// Lấy danh sách học sinh theo lớp
app.get('/api/classes/:classId/students', async (req, res) => {
  try {
    const { classId } = req.params;
    const result = await pool.query(
      'SELECT * FROM students WHERE class_id = $1 ORDER BY name ASC',
      [classId]
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách học sinh:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Thêm học sinh
app.post('/api/students', async (req, res) => {
  try {
    const { name, student_code, class_id, email, phone } = req.body;
    const result = await pool.query(
      'INSERT INTO students (name, student_code, class_id, email, phone, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [name, student_code, class_id, email, phone]
    );
    res.json({
      success: true,
      message: 'Thêm học sinh thành công',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Lỗi thêm học sinh:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// ========== SESSIONS ==========
// Lấy danh sách buổi học
app.get('/api/sessions', async (req, res) => {
  try {
    const { classId } = req.query;
    let query = 'SELECT s.*, c.name as class_name FROM sessions s JOIN classes c ON s.class_id = c.id';
    let params = [];
    
    if (classId) {
      query += ' WHERE s.class_id = $1';
      params.push(classId);
    }
    
    query += ' ORDER BY s.date DESC, s.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách buổi học:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Tạo buổi học mới
app.post('/api/sessions', async (req, res) => {
  try {
    const { class_id, date, topic, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO sessions (class_id, date, topic, notes, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [class_id, date, topic, notes]
    );
    res.json({
      success: true,
      message: 'Tạo buổi học thành công',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Lỗi tạo buổi học:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// ========== ATTENDANCE ==========
// Lấy điểm danh của một buổi học
app.get('/api/sessions/:sessionId/attendance', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await pool.query(
      `SELECT a.*, s.name as student_name, s.student_code 
       FROM attendance a 
       JOIN students s ON a.student_id = s.id 
       WHERE a.session_id = $1 
       ORDER BY s.name ASC`,
      [sessionId]
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Lỗi lấy điểm danh:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Ghi điểm danh (tạo hoặc cập nhật)
app.post('/api/attendance', async (req, res) => {
  try {
    const { session_id, student_id, status, notes } = req.body;
    
    // Kiểm tra xem đã có bản ghi chưa
    const existing = await pool.query(
      'SELECT * FROM attendance WHERE session_id = $1 AND student_id = $2',
      [session_id, student_id]
    );
    
    if (existing.rows.length > 0) {
      // Cập nhật
      const result = await pool.query(
        'UPDATE attendance SET status = $1, notes = $2, updated_at = NOW() WHERE session_id = $3 AND student_id = $4 RETURNING *',
        [status, notes, session_id, student_id]
      );
      res.json({
        success: true,
        message: 'Cập nhật điểm danh thành công',
        data: result.rows[0]
      });
    } else {
      // Tạo mới
      const result = await pool.query(
        'INSERT INTO attendance (session_id, student_id, status, notes, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [session_id, student_id, status, notes]
      );
      res.json({
        success: true,
        message: 'Ghi điểm danh thành công',
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Lỗi ghi điểm danh:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Ghi điểm danh hàng loạt
app.post('/api/attendance/bulk', async (req, res) => {
  try {
    const { session_id, attendance_list } = req.body; // attendance_list: [{student_id, status, notes}]
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const item of attendance_list) {
        const existing = await client.query(
          'SELECT * FROM attendance WHERE session_id = $1 AND student_id = $2',
          [session_id, item.student_id]
        );
        
        if (existing.rows.length > 0) {
          await client.query(
            'UPDATE attendance SET status = $1, notes = $2, updated_at = NOW() WHERE session_id = $3 AND student_id = $4',
            [item.status, item.notes || '', session_id, item.student_id]
          );
        } else {
          await client.query(
            'INSERT INTO attendance (session_id, student_id, status, notes, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [session_id, item.student_id, item.status, item.notes || '']
          );
        }
      }
      
      await client.query('COMMIT');
      res.json({
        success: true,
        message: 'Ghi điểm danh hàng loạt thành công'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Lỗi ghi điểm danh hàng loạt:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Thống kê điểm danh theo học sinh
app.get('/api/students/:studentId/attendance-stats', async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE a.status = 'present') as present_count,
        COUNT(*) FILTER (WHERE a.status = 'absent') as absent_count,
        COUNT(*) FILTER (WHERE a.status = 'late') as late_count,
        COUNT(*) as total_sessions
       FROM attendance a
       WHERE a.student_id = $1`,
      [studentId]
    );
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Lỗi thống kê điểm danh:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'Server và database hoạt động bình thường'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi kết nối database'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

