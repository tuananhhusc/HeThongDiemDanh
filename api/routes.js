// API Routes cho Vercel Serverless Functions
// Export tất cả routes dưới dạng module

const { Pool } = require('pg');

// Database connection pool (reuse across invocations)
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1 // Important for serverless
    });
  }
  return pool;
}

// Export route handlers
module.exports = {
  // Authentication
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const db = getPool();
      
      const result = await db.query(
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
  },

  // Classes
  async getClasses(req, res) {
    try {
      const db = getPool();
      const result = await db.query('SELECT * FROM classes ORDER BY name ASC');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Lỗi lấy danh sách lớp:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  async createClass(req, res) {
    try {
      const { name, description } = req.body;
      const db = getPool();
      const result = await db.query(
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
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // Students
  async getStudents(req, res) {
    try {
      const { classId } = req.params;
      const db = getPool();
      const result = await db.query(
        'SELECT * FROM students WHERE class_id = $1 ORDER BY name ASC',
        [classId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Lỗi lấy danh sách học sinh:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  async createStudent(req, res) {
    try {
      const { name, student_code, class_id, email, phone } = req.body;
      const db = getPool();
      const result = await db.query(
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
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // Sessions
  async getSessions(req, res) {
    try {
      const { classId } = req.query;
      const db = getPool();
      let query = 'SELECT s.*, c.name as class_name FROM sessions s JOIN classes c ON s.class_id = c.id';
      let params = [];
      
      if (classId) {
        query += ' WHERE s.class_id = $1';
        params.push(classId);
      }
      
      query += ' ORDER BY s.date DESC, s.created_at DESC';
      const result = await db.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Lỗi lấy danh sách buổi học:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  async createSession(req, res) {
    try {
      const { class_id, date, topic, notes } = req.body;
      const db = getPool();
      const result = await db.query(
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
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // Attendance
  async getAttendance(req, res) {
    try {
      const { sessionId } = req.params;
      const db = getPool();
      const result = await db.query(
        `SELECT a.*, s.name as student_name, s.student_code 
         FROM attendance a 
         JOIN students s ON a.student_id = s.id 
         WHERE a.session_id = $1 
         ORDER BY s.name ASC`,
        [sessionId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Lỗi lấy điểm danh:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  async bulkAttendance(req, res) {
    try {
      const { session_id, attendance_list } = req.body;
      const db = getPool();
      const client = await db.connect();
      
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
  },

  // Health check
  async health(req, res) {
    try {
      const db = getPool();
      await db.query('SELECT 1');
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
  }
};

