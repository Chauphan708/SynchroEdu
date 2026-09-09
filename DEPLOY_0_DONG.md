# HƯỚNG DẪN TRIỂN KHAI MIỄN PHÍ 100% (DEPLOY 0 ĐỒNG TRỌN ĐỜI)
## ĐƯA EDUMATRIX - SHCM PRO LÊN INTERNET CHO TOÀN TRƯỜNG & CỤM SỬ DỤNG

Hệ thống được thiết kế để vận hành hoàn toàn miễn phí trọn đời bằng cách kết hợp 3 nền tảng đám mây uy tín hàng đầu:
1. **Frontend Web & PWA**: Vercel hoặc Cloudflare Pages (Miễn phí vĩnh viễn, băng thông không giới hạn, hỗ trợ tên miền riêng `.edu.vn`).
2. **Cơ sở dữ liệu Đám mây (Database)**: Supabase Cloud (PostgreSQL) - Miễn phí 500MB lưu trữ văn bản (đủ dùng hàng chục năm).
3. **Kho Tệp Nặng (Video bài giảng, Slide PowerPoint, Ảnh CSVC)**: Tích hợp Google Drive của trường/tổ (Miễn phí 15GB hoặc không giới hạn nếu có Google Workspace for Education).

---

## BƯỚC 1: ĐƯA WEBSITE LÊN INTERNET QUA VERCEL (MẤT 2 PHÚT)

1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub hoặc Google.
2. Bấm nút **"Add New..."** $\rightarrow$ Chọn **"Project"**.
3. Kéo thả toàn bộ thư mục `Trợ lí_Đội Agent` (chứa các file `index.html`, `manifest.json`, `sw.js`, `package.json`) lên Vercel.
4. Bấm nút **"Deploy"**.
5. Sau 30 giây, Vercel sẽ cấp cho bạn một đường link miễn phí dạng:  
   `https://th-phuthanh.vercel.app`  
   *(Bạn có thể gắn tên miền chính thức của trường như `shcm.thphuthanh.edu.vn` hoàn toàn miễn phí)*.

---

## BƯỚC 2: KẾT NỐI SUPABASE POSTGRESQL (NẾU DÙNG CLOUD REALTIME)

1. Truy cập [https://supabase.com](https://supabase.com) và tạo một tài khoản miễn phí.
2. Bấm **"New project"** $\rightarrow$ Đặt tên dự án (ví dụ: `edumatrix-phuthanh`), chọn khu vực máy chủ `Singapore` (để tải nhanh nhất tại Việt Nam).
3. Vào mục **SQL Editor** trong bảng điều khiển của Supabase.
4. Mở tệp `supabase_schema.sql` trong thư mục này, sao chép toàn bộ nội dung và dán vào SQL Editor của Supabase $\rightarrow$ Bấm nút **"Run"**.
5. Cơ sở dữ liệu 12 bảng, triggers tính trễ hạn và tài khoản 32 giáo viên sẽ được khởi tạo tự động trong 5 giây!

---

## BƯỚC 3: KẾT NỐI KHO TỆP GOOGLE DRIVE CỦA TRƯỜNG (0 ĐỒNG)

1. Tạo một thư mục trên Google Drive của trường đặt tên: `KHO_HOC_LIEU_SO_PHUTHANH`.
2. Chuột phải vào thư mục $\rightarrow$ Chọn **Chia sẻ** $\rightarrow$ Đặt quyền: *"Bất kỳ ai có liên kết đều có thể xem"*.
3. Khi giáo viên tải lên video bài giảng hoặc slide Canva/PowerPoint, chỉ cần dán đường link chia sẻ của Google Drive vào hệ thống.
4. Người xem có thể bấm vào nút **"Xem trực tiếp Google Drive"** để xem ngay trên trình duyệt mà trường không phải trả 1 xu tiền thuê máy chủ lưu trữ!

---

## BƯỚC 4: CÀI ĐẶT LÊN ĐIỆN THOẠI GIÁO VIÊN (PWA)

* **Trên điện thoại Android (Chrome/Cốc Cốc):**
  * Truy cập link web $\rightarrow$ Bấm vào dấu 3 chấm góc trên bên phải $\rightarrow$ Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào Màn hình chính"**.
* **Trên iPhone / iPad (Safari):**
  * Truy cập link web $\rightarrow$ Bấm vào nút **Chia sẻ** (biểu tượng hình vuông có mũi tên chỉ lên) $\rightarrow$ Chọn **"Thêm vào Màn hình chính (Add to Home Screen)"**.
* Biểu tượng ứng dụng **EduMatrix** màu xanh ngọc bích sẽ xuất hiện trên màn hình điện thoại, mở lên dùng mượt mà như một App tải từ App Store.
