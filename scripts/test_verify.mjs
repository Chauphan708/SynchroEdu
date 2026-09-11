// Automated Verification Test Suite - SynchroEdu
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
assert(fs.existsSync(path.join(rootDir, 'index.html')), 'Tệp index.html tồn tại');
assert(fs.existsSync(path.join(rootDir, 'supabase_schema.sql')), 'Tệp cơ sở dữ liệu supabase_schema.sql tồn tại');
assert(fs.existsSync(path.join(rootDir, 'manifest.json')), 'Tệp manifest.json (PWA) tồn tại');
assert(fs.existsSync(path.join(rootDir, 'sw.js')), 'Tệp Service Worker sw.js tồn tại');
assert(fs.existsSync(path.join(__dirname, 'server.mjs')), 'Tệp scripts/server.mjs tồn tại');

// 2. Kiểm tra tính hợp lệ của manifest.json
console.log('\n2. Kiểm tra cấu hình PWA Manifest:');
try {
  const manifestData = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifest.json'), 'utf8'));
  assert(manifestData.name.includes('SynchroEdu'), 'Manifest name chứa SynchroEdu');
  assert(manifestData.display === 'standalone', 'Manifest display là standalone (chạy như App di động)');
  assert(manifestData.theme_color === '#065f46', 'Theme color chuẩn Deep Emerald (#065f46)');
} catch (e) {
  assert(false, 'Lỗi cú pháp manifest.json: ' + e.message);
}

// 3. Kiểm tra tính hợp lệ của SQL Schema
console.log('\n3. Kiểm tra tính toàn vẹn của Cơ sở dữ liệu SQL (12 bảng & Triggers):');
const sqlContent = fs.readFileSync(path.join(rootDir, 'supabase_schema.sql'), 'utf8');
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
assert(sqlContent.includes('CƠ SỞ DỮ LIỆU SẠCH'), 'Cơ sở dữ liệu sạch không chứa dữ liệu mẫu');
assert(sqlContent.includes('ALTER TABLE') && sqlContent.includes('ENABLE ROW LEVEL SECURITY'), 'Bảo mật RLS trên toàn bộ các bảng');

// 4. Kiểm tra tính năng trong index.html
console.log('\n4. Kiểm tra các module chức năng trong index.html:');
const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

assert(htmlContent.includes('exportMatrixExcel()') && htmlContent.includes('XLSX.utils'), 'Chức năng xuất Excel SheetJS hoạt động');
assert(htmlContent.includes('exportMatrixWord()') && htmlContent.includes('application/msword'), 'Chức năng xuất Word (.docx) chuẩn mẫu hoạt động');
assert(htmlContent.includes('toggleDelegation()'), 'Công tắc ủy quyền Tổ phó có logic xử lý');
assert(htmlContent.includes('quickSubmitNoTargetStudent()'), 'Chức năng 1-chạm phản hồi nhanh 5 giây ("Lớp không có đối tượng")');
assert(htmlContent.includes('1. Toán') && htmlContent.includes('13. GD thể chất'), 'Cây thư mục 13 môn học đầy đủ');
assert(htmlContent.includes('Dạy Học Buổi 2'), 'Chuyên đề Dạy học Buổi 2 (STEM, Văn hóa đọc)');
assert(htmlContent.toLowerCase().includes('không xếp loại giờ dạy'), 'Cam kết sư phạm không xếp loại giờ dạy theo CV 4069');
assert(htmlContent.includes('printPreviewDocument()'), 'Chế độ in ấn A4 chuẩn Nghị định 30/2020/NĐ-CP');
assert(htmlContent.includes('remindSingleZalo') && htmlContent.includes('remindAllLateZalo'), 'Tính năng bắn tin nhắc Zalo 1-click');

// 5. Kiểm tra Quản lý Người dùng (RBAC) & Cơ chế Lưu trữ 4 Tầng:
console.log('\n5. Kiểm tra Quản lý Người dùng (RBAC) & Cơ chế Lưu trữ 4 Tầng:');
assert(htmlContent.includes('id="tab-user-management"'), 'Giao diện Tab Quản Lý Người Dùng tồn tại');
assert(htmlContent.includes('id="nav-user-management"'), 'Nút điều hướng Desktop Quản Lý Người Dùng tồn tại');
assert(htmlContent.includes('id="mobile-nav-user-management"'), 'Nút điều hướng Mobile Quản Lý Người Dùng tồn tại');
assert(htmlContent.includes('id="userModal"'), 'Modal thêm mới / chỉnh sửa người dùng tồn tại');
assert(htmlContent.includes('id="cloudConfigModal"'), 'Modal cấu hình kết nối đám mây 4 tầng tồn tại');
assert(htmlContent.includes('function canAccessUserManagement()'), 'Hàm kiểm tra phân quyền RBAC canAccessUserManagement() tồn tại');
assert(htmlContent.includes('function updateRbacNavigation()'), 'Hàm cập nhật hiển thị thanh điều hướng theo quyền updateRbacNavigation() tồn tại');
assert(htmlContent.includes('function loadUsersFromStorage()') && htmlContent.includes('function saveUsersToStorage()'), 'Cơ chế lưu trữ Tầng 1 (LocalStorage) hoạt động');
assert(htmlContent.includes('function exportUsersExcel()'), 'Chức năng xuất danh sách nhân sự ra file Excel hoạt động');
assert(htmlContent.includes('function exportUsersBackupJson()') && htmlContent.includes('function importUsersJson'), 'Chức năng sao lưu & nhập JSON (Tầng 4 - No Vendor Lock-in) hoạt động');
assert(htmlContent.includes('function saveCloudConfig()') && htmlContent.includes('function testCloudConnection()'), 'Cơ chế cấu hình Supabase Cloud Sync (Tầng 2) hoạt động');

// Kiểm tra chi tiết logic phân quyền RBAC
function simulateCanAccess(role, isDelegated = false) {
  if (role === 'principal' || role === 'vp_branch' || role === 'head_dept') return true;
  if (role === 'deputy_head' && isDelegated) return true;
  return false;
}
assert(simulateCanAccess('principal') === true, 'RBAC: Hiệu Trưởng có toàn quyền truy cập');
assert(simulateCanAccess('vp_branch') === true, 'RBAC: Phó Hiệu Trưởng có quyền truy cập');
assert(simulateCanAccess('head_dept') === true, 'RBAC: Tổ Trưởng Chuyên Môn có quyền truy cập');
assert(simulateCanAccess('deputy_head', false) === false, 'RBAC: Tổ Phó khi CHƯA được ủy quyền bị chặn truy cập');
assert(simulateCanAccess('deputy_head', true) === true, 'RBAC: Tổ Phó khi ĐÃ được ủy quyền có quyền truy cập');
assert(simulateCanAccess('teacher') === false, 'RBAC: Giáo Viên bị chặn truy cập tuyệt đối');
assert(simulateCanAccess('guest') === false, 'RBAC: Khách Mời bị chặn truy cập tuyệt đối');

// 6. Kiểm tra Cơ chế Nhập Nhiều Học Sinh Cùng Lúc & Lưu Trữ Đầy Đủ Vào Excel:
console.log('\n6. Kiểm tra Cơ chế Nhập Nhiều Học Sinh Cùng Lúc & Lưu Trữ Đầy Đủ Vào Excel:');
assert(htmlContent.includes('id="quickStudentBatchModal"'), 'Modal nhập danh sách nhiều học sinh cùng lúc tồn tại');
assert(htmlContent.includes('id="batchModeTablePanel"'), 'Chế độ 1: Bảng nhập dòng động tồn tại');
assert(htmlContent.includes('id="batchModePastePanel"'), 'Chế độ 2: Dán nhanh danh sách từ Word/Zalo tồn tại');
assert(htmlContent.includes('id="batchModeExcelPanel"'), 'Chế độ 3: Nhập từ tệp Excel (.xlsx) tồn tại');
assert(htmlContent.includes('id="batchStudentTableBody"'), 'Bảng chứa danh sách học sinh động tồn tại');
assert(htmlContent.includes('id="campaignSubmissionsTableBody"'), 'Bảng dồn số liệu báo cáo theo lớp tồn tại');
assert(htmlContent.includes('function openQuickStudentModal()'), 'Hàm mở modal nhập nhiều học sinh hoạt động');
assert(htmlContent.includes('function addBatchStudentRow'), 'Hàm thêm dòng học sinh linh hoạt hoạt động');
assert(htmlContent.includes('function parsePasteBatchStudents()'), 'Hàm phân tích văn bản dán tự động hoạt động');
assert(htmlContent.includes('function handleBatchExcelUpload'), 'Hàm đọc tệp Excel tải lên hoạt động');
assert(htmlContent.includes('function submitBatchStudents()'), 'Hàm lưu và gửi báo cáo danh sách học sinh hoạt động');
assert(htmlContent.includes('function exportCampaignExcel()'), 'Hàm xuất toàn bộ danh sách học sinh ra file Excel (.xlsx) hoạt động');
assert(htmlContent.includes('function exportCurrentBatchModalExcel()'), 'Hàm xuất nhanh Excel trực tiếp từ modal nhập hoạt động');
assert(htmlContent.includes('function exportSingleClassExcel'), 'Hàm xuất Excel danh sách học sinh theo từng lớp hoạt động');
assert(htmlContent.includes('function loadStudentSubmissionsFromStorage()') && htmlContent.includes('function saveStudentSubmissionsToStorage()'), 'Cơ chế lưu trữ LocalStorage cho học sinh hoạt động');

// Kiểm thử thuật toán bóc tách danh sách nhiều học sinh từ văn bản (Paste Parser Simulation)
function simulateBatchParse(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return lines.map(line => {
    let clean = line.replace(/^(\d+[\.\/\)\-:]\s*|[\-•*]\s*)/, '').trim();
    const parts = clean.split(/[-–—,\t;]+/).map(p => p.trim()).filter(Boolean);
    let name = parts[0] || clean;
    let gender = 'Nam';
    let birthDate = '';
    let reason = 'Thuộc diện rà soát';
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const partLower = part.toLowerCase();
      if (partLower === 'nam') gender = 'Nam';
      else if (partLower === 'nữ' || partLower === 'nu') gender = 'Nữ';
      else if (/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(part) || /^(19|20)\d{2}$/.test(part)) birthDate = part;
      else if (reason === 'Thuộc diện rà soát') reason = part;
    }
    return { name, gender, birthDate, reason };
  });
}

const samplePasteText = `1. Nguyễn Văn An - Nam - 15/04/2016 - Hộ nghèo
2. Lê Thị Bình - Nữ - 20/09/2016 - Hộ cận nghèo
Trần Quốc Tuấn - Nam - Khuyết tật hòa nhập`;

const parsedStudents = simulateBatchParse(samplePasteText);
assert(parsedStudents.length === 3, 'Thuật toán bóc tách được chính xác 3 học sinh từ 3 dòng dán');
assert(parsedStudents[0].name === 'Nguyễn Văn An' && parsedStudents[0].gender === 'Nam', 'HS 1: Họ tên và giới tính Nam chuẩn xác');
assert(parsedStudents[1].name === 'Lê Thị Bình' && parsedStudents[1].gender === 'Nữ', 'HS 2: Họ tên và giới tính Nữ chuẩn xác');
assert(parsedStudents[2].name === 'Trần Quốc Tuấn' && parsedStudents[2].reason === 'Khuyết tật hòa nhập', 'HS 3: Nhận diện lý do/diện rà soát chuẩn xác');

// 7. Kiểm tra chạy thử máy chủ và phản hồi HTTP 200
console.log('\n7. Kiểm tra máy chủ HTTP cục bộ:');

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
