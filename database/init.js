// Script khởi tạo database
// Chạy: node database/init.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  try {
    console.log('🔄 Đang khởi tạo database...');
    
    // Đọc file schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Thực thi schema
    await pool.query(schema);
    console.log('✅ Đã tạo các bảng thành công!');
    
    // Hỏi có muốn seed data không
    if (process.argv.includes('--seed')) {
      const seedPath = path.join(__dirname, 'seed.sql');
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('✅ Đã thêm dữ liệu mẫu thành công!');
    }
    
    console.log('🎉 Khởi tạo database hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khởi tạo database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();

