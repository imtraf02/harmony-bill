# Authentication Implementation Plan

Thêm tính năng xác thực người dùng (Authentication) vào ứng dụng để bảo mật thông tin, yêu cầu người dùng phải đăng nhập mới có thể sử dụng (tạo hợp đồng, xem lịch sử, cài đặt).

> [!IMPORTANT]
> Ứng dụng hiện tại đang sử dụng Supabase và đã cài đặt sẵn package `@supabase/ssr` và `@supabase/supabase-js`. Do đó, chúng ta sẽ sử dụng **Supabase Auth** để quản lý phiên đăng nhập và bảo vệ ứng dụng, đây là giải pháp tối ưu và đồng bộ nhất.

## Open Questions

> [!WARNING]
> Cần bạn xác nhận các câu hỏi sau trước khi bắt đầu:
1. **Đăng ký tài khoản:** Bạn có muốn mở tính năng cho phép bất kỳ ai cũng có thể tự tạo tài khoản không? Hay hệ thống này là nội bộ (chỉ những tài khoản bạn tạo sẵn trên dashboard của Supabase mới có thể đăng nhập)? *Đề xuất: Tạm thời khoá đăng ký tự do để bảo mật thông tin studio.*
2. **Giao diện Đăng nhập:** Giao diện trang đăng nhập sẽ theo tone màu chủ đạo của app (Luxury Gold & Trắng/Đen) đúng không?

## Proposed Changes

---

### Middleware (Bảo vệ các trang)

Thêm Next.js middleware để tự động kiểm tra phiên đăng nhập trên mọi request.

#### [NEW] [middleware.ts](file:///home/imtraf/Projects/harmony-bill/middleware.ts)
- Sử dụng `@supabase/ssr` để tạo function `updateSession`.
- Intercept các request vào ứng dụng.
- Nếu người dùng chưa đăng nhập và đang cố truy cập các trang nội bộ (như `/`, `/contracts`, `/settings`), redirect họ về trang `/login`.

---

### Supabase Server Client

Cập nhật lại cách khởi tạo Supabase Client để hỗ trợ SSR và cookie đúng chuẩn.

#### [MODIFY] [server.ts](file:///home/imtraf/Projects/harmony-bill/lib/supabase/server.ts)
- Hiện tại file này đã có, nhưng sẽ cần kiểm tra và cấu hình chuẩn theo tài liệu của `@supabase/ssr` (có các hàm `get`, `set`, `remove` cookie) để middleware và server actions hoạt động ổn định.

---

### Authentication UI & Actions

Tạo giao diện đăng nhập và các hàm xử lý xác thực.

#### [NEW] [app/login/page.tsx](file:///home/imtraf/Projects/harmony-bill/app/login/page.tsx)
- Tạo một UI trang đăng nhập theo thiết kế sang trọng (luxury).
- Form chứa trường Email và Password.
- Gọi Server Action để xử lý việc submit form.

#### [NEW] [app/login/actions.ts](file:///home/imtraf/Projects/harmony-bill/app/login/actions.ts)
- `login(formData: FormData)`: Nhận email/password, gọi Supabase Auth để sign in.
- `logout()`: Xoá cookie session và chuyển hướng người dùng về trang `/login`.

---

### Cập nhật UI chung (Tuỳ chọn Đăng xuất)

Thêm nút Đăng xuất (Logout) vào giao diện để người dùng có thể thoát khỏi phiên làm việc.

#### [MODIFY] [app/page.tsx](file:///home/imtraf/Projects/harmony-bill/app/page.tsx) / Các trang chính
- Thêm một nút Logout nhỏ ở góc màn hình hoặc trong menu điều hướng (nếu có).

## Verification Plan

### Automated/Manual Testing
1. **Kiểm tra Middleware:** Thử truy cập trực tiếp vào `http://localhost:3000/contracts` khi chưa đăng nhập -> Phải bị redirect về `/login`.
2. **Kiểm tra Login Flow:** Nhập sai tài khoản (báo lỗi), nhập đúng tài khoản (redirect vào trang chủ).
3. **Kiểm tra Logout Flow:** Bấm nút đăng xuất -> Chuyển về `/login`, ấn Back trên trình duyệt không thể vào lại app.
4. **Kiểm tra SSR:** Load lại trang chủ khi đã đăng nhập, thông tin (như danh sách hợp đồng) phải load bình thường mà không bị lỗi xác thực.
