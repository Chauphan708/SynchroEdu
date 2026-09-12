# HƯỚNG DẪN SỬ DỤNG: NỀN TẢNG SYNCHROEDU - TRƯỜNG TIỂU HỌC TRUNG NHỨT
## HỆ THỐNG QUẢN TRỊ CHUYÊN MÔN SỐ & BÁO CÁO MA TRẬN 2D CẤP TIỂU HỌC
*(Đơn vị chủ quản: UBND Phường Trung Nhứt | Bám sát Công văn số 4069/BGDĐT-GDPT và Thông tư số 27/2020/TT-BGDĐT)*

---

## I. CÁCH KHỞI CHẠY HỆ THỐNG

### Cách 1: Mở Trực Tiếp Trên Trình Duyệt (Không cần cài đặt)
* Nhấp đúp chuột vào tệp `index.html` trong thư mục này để mở trên bất kỳ trình duyệt nào (Chrome, Cốc Cốc, Edge, Safari).
* Ứng dụng hoạt động ngay lập tức cả khi có mạng lẫn khi mất mạng (Offline-First).

### Cách 2: Chạy Qua Máy Chủ Node.js (Tối ưu cài đặt PWA)
* Mở terminal tại thư mục này và chạy lệnh:
  ```bash
  npm start
  # hoặc: node server.mjs
  ```
* Mở trình duyệt truy cập: `http://localhost:3000`
* Trên thanh địa chỉ trình duyệt, bấm vào biểu tượng **"Cài đặt ứng dụng" (Install App)** để cài SynchroEdu về màn hình chính máy tính hoặc điện thoại như một App độc lập.

---

## II. HƯỚNG DẪN DÀNH CHO CÁC VAI TRÒ

### 1. 🏫 Dành Cho Hiệu Trưởng (Bàn Chỉ Đạo Vĩ Mô)
* **Bảng Ma trận 5×6**: Quan sát toàn cảnh 5 Phân hiệu $\times$ 6 Tổ/Khối. Ô màu xanh là bình thường, ô màu đỏ/vàng là có vướng mắc hoặc trễ hạn.
* **Phát thông báo khẩn 🚨**: Nhấp vào nút *"Phát thông báo khẩn"* để gửi chỉ đạo hỏa tốc (nghỉ học do mưa bão, dịch bệnh) đến tất cả 32 giáo viên dưới 1 giây.
* **Thu thập dữ liệu đột xuất (REQ Engine)**: Bấm *"Tạo yêu cầu đột xuất REQ (+)"*, nhập nội dung (ví dụ: *Rà soát học sinh khó khăn nhận học bổng*), theo dõi danh sách dồn về trực tiếp từ 32 lớp và bấm nút **Tải Excel** nộp UBND Phường Trung Nhứt.
* **Xuất báo cáo cấp trên**:
  * Bấm nút **"Xuất file Word (.docx)"** để tải về văn bản hành chính theo chuẩn **Nghị định 30/2020/NĐ-CP**.
  * Bấm nút **"Xuất file Excel (.xlsx)"** để tải bảng tổng hợp số liệu.

### 2. 🏢 Dành Cho Phó Hiệu Trưởng Phụ Trách Điểm Trường (Luồng Dọc)
* Vào mục **"Luồng Dọc: CSVC & Sĩ Số"**:
  * Chọn điểm trường mình phụ trách (ví dụ: Điểm 3, Điểm 4).
  * Xem sĩ số chuyên cần hàng ngày và danh sách học sinh vắng.
  * Xem danh sách thiết bị hư hỏng (quạt hỏng, mất nước, dột mái) kèm **ảnh chụp hiện trường từ camera giáo viên** gửi về.
  * Bấm nút *"Cập nhật đã sửa / Giao thợ"* sau khi đã xử lý xong.

### 3. 👑 Dành Cho Tổ Trưởng Chuyên Môn
* **Ủy quyền cho Tổ phó**: Trên thanh công cụ trên cùng, bật công tắc: `[Ủy quyền Tổ phó: BẬT]`. Tổ phó lập tức nhận toàn bộ quyền phê duyệt bài giảng, duyệt biên bản khi Tổ trưởng bận công tác.
* **Theo dõi Luồng Ngang**: Vào mục *"Luồng Ngang: Khối 5 Điểm"*, theo dõi tiến độ dạy học 13 môn và danh sách học sinh cần phụ đạo của tất cả các lớp trong khối ở cả 5 điểm trường.
* **Thẩm định kho học liệu số**: Duyệt các bài giảng Canva, đề kiểm tra 3 mức độ (TT 27) của giáo viên trước khi xuất bản dùng chung.
* **Biên bản sinh hoạt chuyên môn**: Vào mục *"Nghiên Cứu Bài Học"*, bấm nút *"Tóm tắt bằng AI"* để sinh tự động biên bản họp tổ và bấm *"Xuất file Word (.docx)"* lưu hồ sơ.

### 4. 🎗️ Dành Cho Tổ Phó Chuyên Môn
* Khi chưa ủy quyền: Giảng dạy lớp phụ trách và hỗ trợ theo dõi nề nếp khối.
* Khi **Tổ trưởng BẬT ủy quyền**: Giao diện tự động chuyển sang chế độ `TỔ PHÓ (ĐƯỢC ỦY QUYỀN ĐIỀU HÀNH)` với đầy đủ quyền duyệt biên bản, thẩm định tài liệu như Tổ trưởng.

### 5. 👩‍🏫 Dành Cho Giáo Viên (1 Nguồn Nhập Duy Nhất)
* **Báo cáo tuần 3 tab (thực hiện thứ Sáu hàng tuần)**:
  * Tab 1 (Chuyên môn): Chọn môn học, báo tiến độ đúng/chậm, danh sách học sinh cần kèm cặp.
  * Tab 2 (Cơ sở vật chất): Báo hỏng hóc, bấm chụp ảnh hiện trường camera.
  * Tab 3 (Đề xuất): Gửi ý kiến lên BGH/Tổ.
* **Phản hồi yêu cầu đột xuất trong 30 giây**: Khi có thông báo REQ, vào mục *"Thu Thập Đột Xuất"*:
  * Bấm nút 1-chạm: *"Lớp không có đối tượng (5 giây)"* nếu lớp không có học sinh thuộc diện.
  * Hoặc bấm *"Nhập nhanh (30 giây)"* để thêm tên học sinh.
* **Khai thác kho học liệu**: Tìm kiếm bài giảng, đề kiểm tra theo Yêu cầu cần đạt (YCCĐ) và xem trực tiếp Google Drive 0đ.

### 6. 🤝 Dành Cho Khách Mời Cụm Chuyên Môn (Trường Bạn)
* Vào mục **"Cổng Cụm & QR Dự Giờ"**:
  * Quét mã QR bằng camera Zalo điện thoại để xem trực tiếp Kế hoạch bài dạy (KHBD) minh họa.
  * Xem và tải miễn phí các tài nguyên được gắn nhãn *"Chia sẻ Cụm"*.

---

## III. TÍNH NĂNG XUẤT BÁO CÁO & SAO LƯU 0 ĐỒNG

1. **Xuất Excel (SheetJS)**: Tạo file `.xlsx` thật sự, chuẩn cột, không bị lỗi font tiếng Việt.
2. **Xuất Word (`.docx` / `.doc`)**: Định dạng sẵn văn bản hành chính theo Nghị định 30/2020/NĐ-CP (Times New Roman, căn lề chuẩn).
3. **In ấn A4 trực tiếp**: Hỗ trợ in trang báo cáo và biên bản sạch đẹp, không dính thanh menu hay icon thừa.
4. **Sao lưu dữ liệu 0đ (No Vendor Lock-in)**: Bấm nút *"Sao lưu 0đ"* ở góc trên bên phải để tải file `SynchroEdu_FullBackup_PhuThanh.json` về máy tính lưu trữ an toàn trọn đời.
