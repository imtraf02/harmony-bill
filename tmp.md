# Đại tu UI/UX — Tối ưu Mobile + Drawer thay Select

## Tổng quan

Codebase hiện tại đã có nền tảng thiết kế tốt (gold theme, cards, sticky bar) nhưng vẫn còn một số điểm chưa tối ưu cho mobile:

1. **`Select` trong `BillForm`** (chọn gói dịch vụ) bị overflow trên màn hình nhỏ, UX kém khi danh sách dài.
2. **Layout trang chủ** — trên mobile chỉ hiển thị form (cột trái), preview ẩn nhưng vẫn được render vô ích.
3. **Header trang chủ** — logo + tab + action buttons xếp chưa gọn trên mobile.
4. **Trang Contracts** — preview modal dùng `div` tự làm; trên mobile rất khó thao tác (cuộn, đóng).
5. **Dialog Combo / Extra** trong `WeddingContractForm` — hiện dùng Dialog (center modal) tuy đã tốt nhưng chưa theo pattern Drawer (bottom sheet) cho mobile.
6. **DatePicker Popover** — trên mobile, Popover calendar có thể bị che khuất; cần kiểm tra.

---

## Open Questions

> [!IMPORTANT]
> Cần xác nhận trước khi thực thi:
> 1. **Drawer vs Dialog**: Với `BillForm` → `Select` gói dịch vụ, thay bằng Drawer (bottom sheet) hay vẫn giữ Dialog như `WeddingContractForm`?  
>    → *Đề xuất: dùng Drawer cho tất cả "chọn từ danh sách" trên mobile (detect `useIsMobile()`)*
> 2. **Preview trên mobile**: Hiện tại preview ẩn trên mobile (không render). Bạn có muốn thêm nút "Xem trước" mở preview trong Drawer không? Hay giữ nguyên?
> 3. **Contracts page**: Preview overlay hiện là `div` tự làm. Thay bằng Drawer (bottom sheet) trên mobile + Dialog/Sheet trên desktop?

---

## Đề xuất thay đổi

### 1. Thêm hook `useIsMobile`

#### [MODIFY] [hooks/](file:///home/imtraf/Projects/harmony-bill/hooks)
Tạo `hooks/use-is-mobile.ts` — hook detect breakpoint mobile (`< 768px`) để quyết định render Drawer hay Dialog.

---

### 2. `BillForm` — Thay `Select` bằng Drawer trên mobile

#### [MODIFY] [bill-form.tsx](file:///home/imtraf/Projects/harmony-bill/components/bill-form.tsx)

**Hiện tại**: Mỗi package dùng `<Select>` → `<SelectTrigger>` → `<SelectContent>` với danh sách gói.  
**Vấn đề**: Trên mobile, `SelectContent` pop up nhỏ, khó tap, text bị cắt.

**Thay đổi**:
- Tạo component `PackagePickerButton` — trên mobile mở `Drawer` (bottom sheet), trên desktop giữ `Select`.
- Drawer hiển thị danh sách gói theo card layout giống Dialog combo của `WeddingContractForm`.
- Logic `useIsMobile()` → nếu mobile → `Drawer`, ngược lại → `Select`.

---

### 3. `WeddingContractForm` — Đổi Dialog → Drawer cho Combo & Extra Dialogs

#### [MODIFY] [wedding-contract-form.tsx](file:///home/imtraf/Projects/harmony-bill/components/wedding-contract-form.tsx)

**Hiện tại**: `isComboDialogOpen` và `isExtraDialogOpen` dùng `Dialog` (center modal).  
**Thay đổi**: Đổi sang `Drawer` (bottom sheet) — phù hợp mobile hơn vì:
- Bottom sheet dễ thao tác bằng ngón cái.
- Không che mất context của form phía sau (chỉ che một phần).
- Có handle để kéo đóng, native-feeling hơn.

Giữ nguyên `Dialog` cho `isDownloadDialogOpen` vì đó là confirmation dialog ngắn, không phải danh sách.

---

### 4. `ContractsPage` — Preview overlay → Drawer trên mobile

#### [MODIFY] [app/contracts/page.tsx](file:///home/imtraf/Projects/harmony-bill/app/contracts/page.tsx)

**Hiện tại**: Khi click vào contract → hiện overlay `div` che toàn màn hình.  
**Vấn đề**: Trên mobile, overlay khó đóng, action buttons (Tải ảnh, In) bị nhỏ và khó tap.

**Thay đổi**:
- Dùng `Drawer` (bottom sheet) thay overlay tự làm trên mobile.
- Action buttons (Tải ảnh, In, Đóng) đặt trong `DrawerFooter` — dễ tap hơn.
- Trên desktop: giữ nguyên modal hoặc chuyển sang `Dialog` proper.

---

### 5. Header trang chủ — Cải thiện layout mobile

#### [MODIFY] [app/page.tsx](file:///home/imtraf/Projects/harmony-bill/app/page.tsx)

**Hiện tại**: Header dùng `flex-col md:flex-row` — trên mobile logo + tab (hàng 1) và actions (hàng 2) xếp chồng, chiếm nhiều không gian.

**Thay đổi**:
- Hàng 1: Logo bên trái + Action buttons (Settings, Lịch sử, Logout) bên phải trong cùng 1 hàng.
- Hàng 2: Tab selector (Phóng sự cưới / Dịch vụ cưới) full-width dạng pill.
- Giảm font size logo trên mobile, ẩn text của một số button khi screen nhỏ.

---

### 6. `BillForm` — Thêm nút "Xem trước" mobile

#### [MODIFY] [app/page.tsx](file:///home/imtraf/Projects/harmony-bill/app/page.tsx)

**Hiện tại**: Preview chỉ hiển thị trên `lg:` (≥1024px). Trên mobile không xem được preview.

**Thay đổi**:
- Thêm nút "👁 Xem trước" trong sticky action bar (đã có ở cả 2 form).
- Click → mở `Drawer` (bottom sheet, high) hoặc `Sheet` (side panel) chứa preview.
- Drawer này chỉ render khi opened (lazy) để tránh double-render.

> [!NOTE]  
> Nếu bạn không muốn thêm tính năng xem trước mobile, bỏ qua mục này.

---

### Các file cần thay đổi

| File | Loại | Mô tả |
|---|---|---|
| `hooks/use-is-mobile.ts` | [NEW] | Hook detect mobile breakpoint |
| `components/bill-form.tsx` | [MODIFY] | Select → Drawer/Select hybrid cho package picker |
| `components/wedding-contract-form.tsx` | [MODIFY] | Dialog → Drawer cho combo & extra selectors |
| `app/contracts/page.tsx` | [MODIFY] | Preview overlay → Drawer trên mobile |
| `app/page.tsx` | [MODIFY] | Cải thiện header mobile + nút Xem trước (tuỳ chọn) |

---

## Components shadcn đã có / cần thêm

| Component | Trạng thái |
|---|---|
| `Drawer` | ✅ Đã cài (`drawer.tsx`) |
| `Dialog` | ✅ Đã cài |
| `Select` | ✅ Đã cài |
| `Sheet` | ❌ Chưa cài — cần nếu dùng side panel cho preview |

---

## Kế hoạch xác minh

### Build check
```bash
pnpm build
```

### Kiểm tra thủ công (trên DevTools → mobile viewport 375px)
1. `BillForm`: Tap "Chọn gói 1" → Drawer mở từ dưới lên, chọn được gói.
2. `WeddingContractForm`: Tap "+ MẪU" → Drawer mở, chọn combo OK.
3. `WeddingContractForm`: Tap "+ DANH SÁCH" → Drawer mở, chọn dịch vụ lẻ OK.
4. Trang Contracts: Tap vào hợp đồng → Drawer preview mở, có nút Tải ảnh và Đóng.
5. Header trang chủ: Hiển thị gọn trên 375px, không bị overflow.
