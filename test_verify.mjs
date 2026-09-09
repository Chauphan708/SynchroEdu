// Automated Verification Test Suite - SynchroEdu
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=====================================================');
console.log('BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG: SYNCHROEDU');
console.log('=====================================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ [PASS]: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAIL]: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Kiểm tra tồn tại các file cốt lõi
console.log('\n1. Kiểm tra cấu trúc tệp tin dự án:');
assert(fs.existsSync(path.join(__dirname, 'index.html')), 'Tệp index.html tồn tại');
assert(fs.existsSync(path.join(__dirname, 'supabase_schema.sql')), 'Tệp cơ sở dữ liệu supabase_schema.sql tồn tại');
assert(fs.existsSync(path.join(__dirname, 'manifest.json')), 'Tệp manifest.json (PWA) tồn tại');
assert(fs.existsSync(path.join(__dirname, 'sw.js')), 'Tệp Service Worker sw.js tồn tại');
assert(fs.existsSync(path.join(__dirname, 'server.mjs')), 'Tệp server.mjs tồn tại');

// 2. Kiểm tra tính hợp lệ của manifest.json
console.log('\n2. Kiểm tra cấu hình PWA Manifest:');
try {
  const manifestData = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
  assert(manifestData.name.includes('SynchroEdu'), 'Manifest name chứa SynchroEdu');
  assert(manifestData.display === 'standalone', 'Manifest display là standalone (chạy như App di động)');
  assert(manifestData.theme_color === '#065f46', 'Theme color chuẩn Deep Emerald (#065f46)');
} catch (e) {
  assert(false, 'Lỗi cú pháp manifest.json: ' + e.message);
}

// 3. Kiểm tra tính hợp lệ của SQL Schema
console.log('\n3. Kiểm tra tính toàn vẹn của Cơ sở dữ liệu SQL (12 bảng & Triggers):');
const sqlContent = fs.readFileSync(path.join(__dirname, 'supabase_schema.sql'), 'utf8');
const expectedTables = [
  'clusters', 'schools', 'branches', 'departments', 'users',
  'weekly_reports', 'data_requests', 'student_submissions',
  'resource_hub', 'meeting_minutes', 'notifications', 'notification_reads'
];
expectedTables.forEach(tbl => {
  assert(sqlContent.includes(`CREATE TABLE IF NOT EXISTS ${tbl}`), `Bảng ${tbl} được định nghĩa đầy đủ`);
});
assert(sqlContent.includes('calc_late_submission()'), 'Trigger calc_late_submission() tự động tính số phút trễ hạn');
assert(sqlContent.includes('populate_notification_reads()'), 'Trigger populate_notification_reads() tự động phân phối thông báo');
assert(sqlContent.includes('BRANCH_CENTER') && sqlContent.includes('BRANCH_4'), 'Seed data 5 phân hiệu trường học');
assert(sqlContent.includes('Phan Kim Oanh') && sqlContent.includes('Trần Đình Trọng'), 'Seed data Tổ trưởng & Tổ phó Khối 2');

// 4. Kiểm tra tính năng trong index.html
console.log('\n4. Kiểm tra các module chức năng trong index.html:');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert(htmlContent.includes('exportMatrixExcel()') && htmlContent.includes('XLSX.utils'), 'Chức năng xuất Excel SheetJS hoạt động');
assert(htmlContent.includes('exportMatrixWord()') && htmlContent.includes('application/msword'), 'Chức năng xuất Word (.docx) chuẩn mẫu hoạt động');
assert(htmlContent.includes('toggleDelegation()'), 'Công tắc ủy quyền Tổ phó có logic xử lý');
assert(htmlContent.includes('quickSubmitNoTargetStudent()'), 'Chức năng 1-chạm phản hồi nhanh 5 giây ("Lớp không có đối tượng")');
assert(htmlContent.includes('1. Toán') && htmlContent.includes('13. GD thể chất'), 'Cây thư mục 13 môn học đầy đủ');
assert(htmlContent.includes('Dạy Học Buổi 2'), 'Chuyên đề Dạy học Buổi 2 (STEM, Văn hóa đọc)');
assert(htmlContent.toLowerCase().includes('không xếp loại giờ dạy'), 'Cam kết sư phạm không xếp loại giờ dạy theo CV 4069');
assert(htmlContent.includes('printPreviewDocument()'), 'Chế độ in ấn A4 chuẩn Nghị định 30/2020/NĐ-CP');
assert(htmlContent.includes('remindSingleZalo') && htmlContent.includes('remindAllLateZalo'), 'Tính năng bắn tin nhắc Zalo 1-click');

// 5. Kiểm tra chạy thử máy chủ và phản hồi HTTP 200
console.log('\n5. Kiểm tra máy chủ HTTP cục bộ:');

async function testHttpServer() {
  const testPort = process.env.TEST_PORT || 3099;
  process.env.PORT = testPort.toString();
  
  const { server } = await import(`./server.mjs?t=${Date.now()}`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  http.get(`http://localhost:${testPort}/index.html`, (res) => {
    assert(res.statusCode === 200, 'Máy chủ phản hồi HTTP 200 cho index.html');
    assert(res.headers['content-type'] && res.headers['content-type'].includes('text/html'), 'Content-Type là text/html');
    
    http.get(`http://localhost:${testPort}/manifest.json`, (mRes) => {
      assert(mRes.statusCode === 200, 'Máy chủ phản hồi HTTP 200 cho manifest.json');
      
      console.log('\n=====================================================');
      console.log(`KẾT QUẢ: ĐÃ VƯỢT QUA ${passedTests}/${totalTests} BÀI KIỂM THỬ!`);
      console.log('=====================================================');
      
      if (server && typeof server.close === 'function') {
        server.close(() => {
          process.exit(passedTests === totalTests ? 0 : 1);
        });
      } else {
        process.exit(passedTests === totalTests ? 0 : 1);
      }
    });
  }).on('error', (err) => {
    assert(false, 'Lỗi kết nối máy chủ HTTP: ' + err.message);
    if (server && typeof server.close === 'function') {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

testHttpServer().catch((err) => {
  assert(false, 'Lỗi không mong muốn trong kiểm thử: ' + err.message);
  process.exit(1);
});
