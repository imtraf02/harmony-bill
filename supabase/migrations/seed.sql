-- ============================================================
-- HARMONY WEDDING - SEED: WEDDING COMBOS
-- Chỉ thêm vào wedding_combos + wedding_combo_services
-- (Không chạm các bảng khác)
-- ============================================================

-- ── CLEAN UP ─────────────────────────────────────────────────
TRUNCATE public.wedding_combo_services CASCADE;
TRUNCATE public.wedding_combos CASCADE;

-- ============================================================
-- NHÓM 1: TRỌN GÓI 1 NGÀY CƯỚI (Phóng sự + Trang phục)
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000001-0000-0000-0000-000000000001',
  'Trọn Gói 1 Ngày Cưới - DIAMOND',
  'Gói 1 ngày cưới Diamond: 1 Váy Signature, 1 Váy Ruby, 1 Bộ Veston Thiết kế, 1 Áo dài dâu/rể, 1 Máy chụp phóng sự, 1 Make up tại nhà, 6 Áo dài phụ dâu/rể, 1 Hoa cầm tay, 1 Album kèm hộp cao cấp, 50 ảnh rửa 13x18',
  11000000
),
(
  'a1000001-0000-0000-0000-000000000002',
  'Trọn Gói 1 Ngày Cưới - RUBY',
  'Gói 1 ngày cưới Ruby: 1 Váy Signature, 1 Váy Ruby, 1 Cặp áo dài dâu rể, 2 Bộ Veston Thiết kế, 2 Caravat phù hợp, 1 Lần trang điểm & làm tóc cô dâu tại Harmony, 1 Máy chụp phóng sự, Phụ kiện đi kèm, 6 Áo dài phụ dâu/rể, 1 Vest sui (áo dài sui), 1 Hoa cầm tay, 1 Album kèm hộp cao cấp, 50 ảnh rửa 18x18',
  12500000
),
(
  'a1000001-0000-0000-0000-000000000003',
  'Trọn Gói 1 Ngày Cưới - SIGNATURE',
  'Gói 1 ngày cưới Signature: 2 Váy Signature, 2 Váy Ruby, 1 Cặp áo dài dâu rể, 2 Bộ Veston Thiết kế, 2 Caravat phù hợp, 1 Lần trang điểm & làm tóc cô dâu tại Harmony Wedding, Phụ kiện đi kèm, 1 Manocanh chụp tại lễ cưới, 1 Máy chụp phóng sự, 1 Hoa cầm tay, 1 Album kèm hộp cao cấp, 50 ảnh rửa 18x18',
  15500000
),
(
  'a1000001-0000-0000-0000-000000000004',
  'Trọn Gói 1 Ngày Cưới - SUPER VIP',
  'Gói 1 ngày cưới Super VIP: 3 Váy Signature, 1 Váy Ruby, 1 Cặp áo dài dâu rể, 1 Ekip riêng take care trong buổi lễ, 2 Bộ Veston Thiết kế, 2 Caravat phù hợp, 1 Lần trang điểm & làm tóc cô dâu tại nhà, Phụ kiện đi kèm, 1 Manocanh chụp tại lễ cưới + Team take care, 2 Máy chụp hình Phóng sự, 1 Hoa cầm tay, 1 Album kèm hộp cao cấp, 50 ảnh rửa 18x18',
  19500000
);

-- Services cho 1 ngày cưới DIAMOND
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000001-0000-0000-0000-000000000001', '1 Váy cưới Signature', 1),
('a1000001-0000-0000-0000-000000000001', '1 Váy Ruby', 2),
('a1000001-0000-0000-0000-000000000001', '1 Bộ Veston Thiết kế', 3),
('a1000001-0000-0000-0000-000000000001', '1 Áo dài dâu/rể', 4),
('a1000001-0000-0000-0000-000000000001', '1 Máy chụp phóng sự (6h-13h hoặc 14h-21h)', 5),
('a1000001-0000-0000-0000-000000000001', '1 Make up tại nhà', 6),
('a1000001-0000-0000-0000-000000000001', '6 Áo dài phụ dâu/rể', 7),
('a1000001-0000-0000-0000-000000000001', '1 Hoa cầm tay', 8),
('a1000001-0000-0000-0000-000000000001', '1 Album kèm hộp cao cấp', 9),
('a1000001-0000-0000-0000-000000000001', '50 ảnh rửa 13x18', 10);

-- Services cho 1 ngày cưới RUBY
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000001-0000-0000-0000-000000000002', '1 Váy cưới Signature', 1),
('a1000001-0000-0000-0000-000000000002', '1 Váy Ruby', 2),
('a1000001-0000-0000-0000-000000000002', '1 Cặp áo dài dâu rể', 3),
('a1000001-0000-0000-0000-000000000002', '2 Bộ Veston Thiết kế', 4),
('a1000001-0000-0000-0000-000000000002', '2 Caravat phù hợp', 5),
('a1000001-0000-0000-0000-000000000002', '1 Lần trang điểm & làm tóc cô dâu tại Harmony Wedding', 6),
('a1000001-0000-0000-0000-000000000002', '1 Máy chụp phóng sự (6h-13h hoặc 14h-21h)', 7),
('a1000001-0000-0000-0000-000000000002', 'Phụ kiện đi kèm', 8),
('a1000001-0000-0000-0000-000000000002', '6 Áo dài phụ dâu/rể', 9),
('a1000001-0000-0000-0000-000000000002', '1 Vest sui (áo dài sui)', 10),
('a1000001-0000-0000-0000-000000000002', '1 Hoa cầm tay', 11),
('a1000001-0000-0000-0000-000000000002', '1 Album kèm hộp cao cấp', 12),
('a1000001-0000-0000-0000-000000000002', '50 ảnh rửa 18x18', 13);

-- Services cho 1 ngày cưới SIGNATURE
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000001-0000-0000-0000-000000000003', '2 Váy cưới Signature', 1),
('a1000001-0000-0000-0000-000000000003', '2 Váy Ruby', 2),
('a1000001-0000-0000-0000-000000000003', '1 Cặp áo dài dâu rể', 3),
('a1000001-0000-0000-0000-000000000003', '2 Bộ Veston Thiết kế', 4),
('a1000001-0000-0000-0000-000000000003', '2 Caravat phù hợp', 5),
('a1000001-0000-0000-0000-000000000003', '1 Lần trang điểm & làm tóc cô dâu tại Harmony Wedding', 6),
('a1000001-0000-0000-0000-000000000003', 'Phụ kiện đi kèm', 7),
('a1000001-0000-0000-0000-000000000003', '1 Manocanh chụp tại lễ cưới', 8),
('a1000001-0000-0000-0000-000000000003', '1 Máy chụp phóng sự (6h-13h hoặc 14h-21h)', 9),
('a1000001-0000-0000-0000-000000000003', '1 Hoa cầm tay', 10),
('a1000001-0000-0000-0000-000000000003', '1 Album kèm hộp cao cấp', 11),
('a1000001-0000-0000-0000-000000000003', '50 ảnh rửa 18x18', 12);

-- Services cho 1 ngày cưới SUPER VIP
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000001-0000-0000-0000-000000000004', '3 Váy cưới Signature', 1),
('a1000001-0000-0000-0000-000000000004', '1 Váy Ruby', 2),
('a1000001-0000-0000-0000-000000000004', '1 Cặp áo dài dâu rể', 3),
('a1000001-0000-0000-0000-000000000004', '1 Ekip riêng take care trong buổi lễ', 4),
('a1000001-0000-0000-0000-000000000004', '2 Bộ Veston Thiết kế', 5),
('a1000001-0000-0000-0000-000000000004', '2 Caravat phù hợp', 6),
('a1000001-0000-0000-0000-000000000004', '1 Lần trang điểm & làm tóc cô dâu tại nhà', 7),
('a1000001-0000-0000-0000-000000000004', 'Phụ kiện đi kèm', 8),
('a1000001-0000-0000-0000-000000000004', '1 Manocanh chụp tại lễ cưới + Team take care', 9),
('a1000001-0000-0000-0000-000000000004', '2 Máy chụp hình Phóng sự (6h-13h hoặc 14h-21h)', 10),
('a1000001-0000-0000-0000-000000000004', '1 Hoa cầm tay', 11),
('a1000001-0000-0000-0000-000000000004', '1 Album kèm hộp cao cấp', 12),
('a1000001-0000-0000-0000-000000000004', '50 ảnh rửa 18x18', 13);

-- ============================================================
-- NHÓM 2: TRỌN GÓI 2 NGÀY CƯỚI (Phóng sự + Trang phục)
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000002-0000-0000-0000-000000000001',
  'Trọn Gói 2 Ngày Cưới - DIAMON',
  'Gói 2 ngày cưới Diamond: 2 Váy Signature, 2 Váy Ruby, 2 Bộ Veston Thiết kế, 1 Áo dài dâu(rể), 2 máy Chụp ảnh PSC, 2 Make up tại nhà, 6 Áo dài phụ dâu/rể, 2 Hoa cầm tay, 1 Album Thiết kế hộp cao cấp có ảnh bìa, 100 ảnh rửa 13x18',
  20900000
),
(
  'a1000002-0000-0000-0000-000000000002',
  'Trọn Gói 2 Ngày Cưới - RUBY',
  'Gói 2 ngày cưới Ruby: 2 Váy Signature, 3 Váy Ruby, 3 Bộ Veston Thiết kế, 1 Cặp Áo dài dâu(rể), 2 máy Chụp ảnh PSC, 2 Make up tại nhà, 6 Áo dài phụ dâu/rể, 1 Veston Ông Sui, 1 Áo dài Bà Sui, 2 Hoa cầm tay, 1 Album Thiết kế hộp cao cấp có ảnh bìa, 100 ảnh rửa 13x18',
  24500000
),
(
  'a1000002-0000-0000-0000-000000000003',
  'Trọn Gói 2 Ngày Cưới - SIGNATURE',
  'Gói 2 ngày cưới Signature: 3 Váy Signature, 2 Váy Ruby, 3 Bộ Veston Thiết kế, 1 Cặp Áo dài dâu(rể), 2 máy Quay Phim PSC, 2 máy Chụp ảnh PSC, 2 Make up tại nhà, 12 Áo dài phụ dâu/rể, 1 Veston Ông Sui, 2 Áo dài Bà Sui, 2 Hoa cầm tay, 1 Album Thiết kế hộp cao cấp có ảnh bìa, 100 ảnh rửa 13x18',
  34900000
);

-- Services cho 2 ngày cưới DIAMON
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000002-0000-0000-0000-000000000001', '2 Váy Signature', 1),
('a1000002-0000-0000-0000-000000000001', '2 Váy Ruby', 2),
('a1000002-0000-0000-0000-000000000001', '2 Bộ Veston Thiết kế', 3),
('a1000002-0000-0000-0000-000000000001', '1 Áo dài dâu(rể)', 4),
('a1000002-0000-0000-0000-000000000001', '2 máy Chụp ảnh PSC (6h-13h hoặc 14h-21h)', 5),
('a1000002-0000-0000-0000-000000000001', '2 Make up tại nhà', 6),
('a1000002-0000-0000-0000-000000000001', '6 Áo dài phụ dâu/rể', 7),
('a1000002-0000-0000-0000-000000000001', '2 Hoa cầm tay', 8),
('a1000002-0000-0000-0000-000000000001', '1 Album Thiết kế hộp cao cấp có ảnh bìa', 9),
('a1000002-0000-0000-0000-000000000001', '100 ảnh rửa 13x18', 10);

-- Services cho 2 ngày cưới RUBY
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000002-0000-0000-0000-000000000002', '2 Váy Signature', 1),
('a1000002-0000-0000-0000-000000000002', '3 Váy Ruby', 2),
('a1000002-0000-0000-0000-000000000002', '3 Bộ Veston Thiết kế', 3),
('a1000002-0000-0000-0000-000000000002', '1 Cặp Áo dài dâu(rể)', 4),
('a1000002-0000-0000-0000-000000000002', '2 máy Chụp ảnh PSC (6h-13h hoặc 14h-21h)', 5),
('a1000002-0000-0000-0000-000000000002', '2 Make up tại nhà', 6),
('a1000002-0000-0000-0000-000000000002', '6 Áo dài phụ dâu/rể', 7),
('a1000002-0000-0000-0000-000000000002', '1 Veston Ông Sui', 8),
('a1000002-0000-0000-0000-000000000002', '1 Áo dài Bà Sui', 9),
('a1000002-0000-0000-0000-000000000002', '2 Hoa cầm tay', 10),
('a1000002-0000-0000-0000-000000000002', '1 Album Thiết kế hộp cao cấp có ảnh bìa', 11),
('a1000002-0000-0000-0000-000000000002', '100 ảnh rửa 13x18', 12);

-- Services cho 2 ngày cưới SIGNATURE
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000002-0000-0000-0000-000000000003', '3 Váy Signature', 1),
('a1000002-0000-0000-0000-000000000003', '2 Váy Ruby', 2),
('a1000002-0000-0000-0000-000000000003', '3 Bộ Veston Thiết kế', 3),
('a1000002-0000-0000-0000-000000000003', '1 Cặp Áo dài dâu(rể)', 4),
('a1000002-0000-0000-0000-000000000003', '2 máy Quay Phim PSC (6h-13h hoặc 14h-21h)', 5),
('a1000002-0000-0000-0000-000000000003', '2 máy Chụp ảnh PSC (6h-13h hoặc 14h-21h)', 6),
('a1000002-0000-0000-0000-000000000003', '2 Make up tại nhà', 7),
('a1000002-0000-0000-0000-000000000003', '12 Áo dài phụ dâu/rể', 8),
('a1000002-0000-0000-0000-000000000003', '1 Veston Ông Sui', 9),
('a1000002-0000-0000-0000-000000000003', '2 Áo dài Bà Sui', 10),
('a1000002-0000-0000-0000-000000000003', '2 Hoa cầm tay', 11),
('a1000002-0000-0000-0000-000000000003', '1 Album Thiết kế hộp cao cấp có ảnh bìa', 12),
('a1000002-0000-0000-0000-000000000003', '100 ảnh rửa 13x18', 13);

-- ============================================================
-- NHÓM 3: COMBO 1 NGÀY CƯỚI (Chỉ Trang phục - Không phóng sự)
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000003-0000-0000-0000-000000000001',
  'Combo 1 Ngày Cưới Trang Phục - DIAMOND',
  'Combo trang phục 1 ngày cưới Diamond: 1 Váy cưới Signature, 1 Váy Ruby, 1 Bộ Veston Thiết kế, 6 Áo dài phụ dâu/rể, 1 Hoa cầm tay. Tặng: Hoa cầm tay + Áo dài phụ dâu/rể (tổng giá trị 1.500.000đ)',
  4900000
),
(
  'a1000003-0000-0000-0000-000000000002',
  'Combo 1 Ngày Cưới Trang Phục - RUBY',
  'Combo trang phục 1 ngày cưới Ruby: 1 Váy cưới Signature, 1 Váy Ruby, 2 Bộ Veston Thiết kế, 6 Áo dài phụ dâu/rể, 1 Vest sui (áo dài sui), 1 Hoa cầm tay. Tặng: Hoa cầm tay + Áo dài phụ dâu/rể (tổng giá trị 1.500.000đ)',
  5900000
),
(
  'a1000003-0000-0000-0000-000000000003',
  'Combo 1 Ngày Cưới Trang Phục - SIGNATURE',
  'Combo trang phục 1 ngày cưới Signature: 1 Váy cưới Signature, 1 Váy Ruby, 2 Bộ Veston Thiết kế, 1 Cặp áo dài dâu/rể, 12 Áo dài phụ dâu/rể, 1 Vest sui, 1 Áo dài sui, 1 Hoa cầm tay. Tặng: Hoa cầm tay + Áo dài phụ dâu/rể (tổng giá trị 1.500.000đ)',
  7000000
);

-- Services cho Combo trang phục 1 ngày DIAMOND
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000003-0000-0000-0000-000000000001', '1 Váy cưới Signature', 1),
('a1000003-0000-0000-0000-000000000001', '1 Váy Ruby', 2),
('a1000003-0000-0000-0000-000000000001', '1 Bộ Veston Thiết kế', 3),
('a1000003-0000-0000-0000-000000000001', '6 Áo dài phụ dâu/rể', 4),
('a1000003-0000-0000-0000-000000000001', '1 Hoa cầm tay', 5),
('a1000003-0000-0000-0000-000000000001', '[Tặng] Hoa cầm tay + Áo dài phụ dâu/rể (giá trị 1.500.000đ)', 6);

-- Services cho Combo trang phục 1 ngày RUBY
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000003-0000-0000-0000-000000000002', '1 Váy cưới Signature', 1),
('a1000003-0000-0000-0000-000000000002', '1 Váy Ruby', 2),
('a1000003-0000-0000-0000-000000000002', '2 Bộ Veston Thiết kế', 3),
('a1000003-0000-0000-0000-000000000002', '6 Áo dài phụ dâu/rể', 4),
('a1000003-0000-0000-0000-000000000002', '1 Vest sui (áo dài sui)', 5),
('a1000003-0000-0000-0000-000000000002', '1 Hoa cầm tay', 6),
('a1000003-0000-0000-0000-000000000002', '[Tặng] Hoa cầm tay + Áo dài phụ dâu/rể (giá trị 1.500.000đ)', 7);

-- Services cho Combo trang phục 1 ngày SIGNATURE
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000003-0000-0000-0000-000000000003', '1 Váy cưới Signature', 1),
('a1000003-0000-0000-0000-000000000003', '1 Váy Ruby', 2),
('a1000003-0000-0000-0000-000000000003', '2 Bộ Veston Thiết kế', 3),
('a1000003-0000-0000-0000-000000000003', '1 Cặp áo dài dâu/rể', 4),
('a1000003-0000-0000-0000-000000000003', '12 Áo dài phụ dâu/rể', 5),
('a1000003-0000-0000-0000-000000000003', '1 Vest sui', 6),
('a1000003-0000-0000-0000-000000000003', '1 Áo dài sui', 7),
('a1000003-0000-0000-0000-000000000003', '1 Hoa cầm tay', 8),
('a1000003-0000-0000-0000-000000000003', '[Tặng] Hoa cầm tay + Áo dài phụ dâu/rể (giá trị 1.500.000đ)', 9);

-- ============================================================
-- NHÓM 4: COMBO 2 NGÀY CƯỚI (Chỉ Trang phục)
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000004-0000-0000-0000-000000000001',
  'Combo 2 Ngày Cưới Trang Phục - DIAMON',
  'Combo trang phục 2 ngày cưới Diamond: 2 Váy Signature, 2 Váy Ruby, 2 Veston cao cấp, 1 Áo dài dâu(rể), 2 Hoa cầm tay',
  9500000
),
(
  'a1000004-0000-0000-0000-000000000002',
  'Combo 2 Ngày Cưới Trang Phục - RUBY',
  'Combo trang phục 2 ngày cưới Ruby: 2 Váy Signature, 3 Váy Ruby, 3 Veston Cao cấp, 1 Cặp áo dài dâu/rể, 6 Áo dài phụ dâu/rể, 1 Veston Ông Sui, 1 Áo dài Bà Sui, 2 Hoa cầm tay',
  13000000
),
(
  'a1000004-0000-0000-0000-000000000003',
  'Combo 2 Ngày Cưới Trang Phục - SIGNATURE',
  'Combo trang phục 2 ngày cưới Signature: 3 Váy Signature, 3 Váy Ruby, 3 Veston Cao Cấp, 1 Cặp áo dài dâu/rể, 6 Áo dài phụ dâu/rể, 1 Vest Ông Sui, 2 Áo dài Bà Sui, 2 Hoa cầm tay',
  16500000
);

-- Services cho Combo trang phục 2 ngày DIAMON
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000004-0000-0000-0000-000000000001', '2 Váy Signature', 1),
('a1000004-0000-0000-0000-000000000001', '2 Váy Ruby', 2),
('a1000004-0000-0000-0000-000000000001', '2 Veston cao cấp', 3),
('a1000004-0000-0000-0000-000000000001', '1 Áo dài dâu(rể)', 4),
('a1000004-0000-0000-0000-000000000001', '2 Hoa cầm tay', 5);

-- Services cho Combo trang phục 2 ngày RUBY
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000004-0000-0000-0000-000000000002', '2 Váy Signature', 1),
('a1000004-0000-0000-0000-000000000002', '3 Váy Ruby', 2),
('a1000004-0000-0000-0000-000000000002', '3 Veston Cao cấp', 3),
('a1000004-0000-0000-0000-000000000002', '1 Cặp áo dài dâu/rể', 4),
('a1000004-0000-0000-0000-000000000002', '6 Áo dài phụ dâu/rể', 5),
('a1000004-0000-0000-0000-000000000002', '1 Veston Ông Sui', 6),
('a1000004-0000-0000-0000-000000000002', '1 Áo dài Bà Sui', 7),
('a1000004-0000-0000-0000-000000000002', '2 Hoa cầm tay', 8);

-- Services cho Combo trang phục 2 ngày SIGNATURE
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000004-0000-0000-0000-000000000003', '3 Váy Signature', 1),
('a1000004-0000-0000-0000-000000000003', '3 Váy Ruby', 2),
('a1000004-0000-0000-0000-000000000003', '3 Veston Cao Cấp', 3),
('a1000004-0000-0000-0000-000000000003', '1 Cặp áo dài dâu/rể', 4),
('a1000004-0000-0000-0000-000000000003', '6 Áo dài phụ dâu/rể', 5),
('a1000004-0000-0000-0000-000000000003', '1 Vest Ông Sui', 6),
('a1000004-0000-0000-0000-000000000003', '2 Áo dài Bà Sui', 7),
('a1000004-0000-0000-0000-000000000003', '2 Hoa cầm tay', 8);

-- ============================================================
-- NHÓM 5: GÓI CHỤP ALBUM PHIM TRƯỜNG
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000005-0000-0000-0000-000000000001',
  'Gói Chụp Album Phim Trường - COMBO 1',
  'Chụp 2 váy + 1 vest, Hoa lụa cầm tay, Make up & tóc theo trang phục. Sản phẩm: 1 Album 25x35 (30 trang), 1 Ảnh 60x90 tráng gương 4K bo viền SIÊU NÉT, 40 ảnh chỉnh sửa. Tặng: 5 Hình nhỏ 15x21 tráng gương 4K, Hộp & túi đựng album cao cấp, Phí chụp tại phim trường',
  6900000
),
(
  'a1000005-0000-0000-0000-000000000002',
  'Gói Chụp Album Phim Trường - COMBO 2',
  'Chụp 2 váy + 2 vest, Hoa lụa cầm tay, Make up & tóc theo trang phục. Sản phẩm: 1 Album 25x35 (36 trang), 2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI, 45 ảnh chỉnh sửa. Tặng: 5 Hình nhỏ 15x21 tráng gương 4K, Hộp & túi đựng album cao cấp, Phí chụp tại phim trường',
  7900000
),
(
  'a1000005-0000-0000-0000-000000000003',
  'Gói Chụp Album Phim Trường - COMBO 3',
  'Chụp 2 váy + 2 vest, Concept hoa tươi, Hoa lụa cầm tay, Make up & tóc theo trang phục. Sản phẩm: 1 Album 25x35 (40 trang), 2 Ảnh 60x90 tráng gương HQ CÔNG NGHỆ MỚI, 50 ảnh chỉnh sửa. Tặng: 5 Hình nhỏ 15x21 tráng gương 4K, Hộp & túi đựng album cao cấp, Phí chụp tại phim trường',
  11500000
);

-- Services cho Album Phim Trường COMBO 1
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000005-0000-0000-0000-000000000001', 'Chụp 2 váy + 1 vest', 1),
('a1000005-0000-0000-0000-000000000001', 'Hoa lụa cầm tay', 2),
('a1000005-0000-0000-0000-000000000001', 'Make up & tóc theo trang phục', 3),
('a1000005-0000-0000-0000-000000000001', '1 Album 25x35 (30 trang)', 4),
('a1000005-0000-0000-0000-000000000001', '1 Ảnh 60x90 tráng gương 4K bo viền SIÊU NÉT', 5),
('a1000005-0000-0000-0000-000000000001', '40 ảnh chỉnh sửa', 6),
('a1000005-0000-0000-0000-000000000001', '[Tặng] 5 Hình nhỏ 15x21 tráng gương 4K', 7),
('a1000005-0000-0000-0000-000000000001', '[Tặng] Hộp & túi đựng album cao cấp', 8),
('a1000005-0000-0000-0000-000000000001', '[Tặng] Phí chụp tại phim trường', 9);

-- Services cho Album Phim Trường COMBO 2
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000005-0000-0000-0000-000000000002', 'Chụp 2 váy + 2 vest', 1),
('a1000005-0000-0000-0000-000000000002', 'Hoa lụa cầm tay', 2),
('a1000005-0000-0000-0000-000000000002', 'Make up & tóc theo trang phục', 3),
('a1000005-0000-0000-0000-000000000002', '1 Album 25x35 (36 trang)', 4),
('a1000005-0000-0000-0000-000000000002', '2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI', 5),
('a1000005-0000-0000-0000-000000000002', '45 ảnh chỉnh sửa', 6),
('a1000005-0000-0000-0000-000000000002', '[Tặng] 5 Hình nhỏ 15x21 tráng gương 4K', 7),
('a1000005-0000-0000-0000-000000000002', '[Tặng] Hộp & túi đựng album cao cấp', 8),
('a1000005-0000-0000-0000-000000000002', '[Tặng] Phí chụp tại phim trường', 9);

-- Services cho Album Phim Trường COMBO 3
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000005-0000-0000-0000-000000000003', 'Chụp 2 váy + 2 vest', 1),
('a1000005-0000-0000-0000-000000000003', 'Concept hoa tươi', 2),
('a1000005-0000-0000-0000-000000000003', 'Hoa lụa cầm tay', 3),
('a1000005-0000-0000-0000-000000000003', 'Make up & tóc theo trang phục', 4),
('a1000005-0000-0000-0000-000000000003', '1 Album 25x35 (40 trang)', 5),
('a1000005-0000-0000-0000-000000000003', '2 Ảnh 60x90 tráng gương HQ CÔNG NGHỆ MỚI', 6),
('a1000005-0000-0000-0000-000000000003', '50 ảnh chỉnh sửa', 7),
('a1000005-0000-0000-0000-000000000003', '[Tặng] 5 Hình nhỏ 15x21 tráng gương 4K', 8),
('a1000005-0000-0000-0000-000000000003', '[Tặng] Hộp & túi đựng album cao cấp', 9),
('a1000005-0000-0000-0000-000000000003', '[Tặng] Phí chụp tại phim trường', 10);

-- ============================================================
-- NHÓM 6: GÓI CHỤP ALBUM PREWEDDING TẠI STUDIO
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000006-0000-0000-0000-000000000001',
  'Gói Chụp Album Prewedding Tại Studio - BASIC',
  'Chụp 1 váy + 1 vest, Make up & tóc theo trang phục, Hỗ trợ phụ kiện cho Dâu, Hỗ trợ tạo dáng, Có màn hình follow dáng pose. Sản phẩm: 1 Ảnh 60x90 tráng gương 4K bo viền SIÊU NÉT, Album 20 trang 25x35 (photobook), Hộp đựng album Cao cấp, 35 file chỉnh sửa. Tặng: 5 ảnh bàn 15x21',
  3900000
),
(
  'a1000006-0000-0000-0000-000000000002',
  'Gói Chụp Album Prewedding Tại Studio - VIP',
  'Chụp 1 váy + 1 vest, Make up & tóc theo trang phục, Hỗ trợ phụ kiện cho Dâu, Hỗ trợ tạo dáng, Có màn hình follow dáng pose. Sản phẩm: 2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI, Album 30 trang 25x35 (photobook), Hộp đựng album Cao cấp, 45 file chỉnh sửa. Tặng: 5 ảnh bàn 15x21',
  4900000
),
(
  'a1000006-0000-0000-0000-000000000003',
  'Gói Chụp Album Prewedding Tại Studio - CONCEPT VIP ĐỘC QUYỀN',
  '1 Concept tự chọn, Chụp 2 váy + 2 vest, Make up & tóc theo trang phục, Hỗ trợ phụ kiện cho Dâu, Hỗ trợ tạo dáng, Có màn hình follow dáng pose. Sản phẩm: 2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI, Album 30 trang 25x35, Hộp đựng album Cao cấp, 50 file chỉnh sửa. Tặng: 5 ảnh bàn 15x21',
  6900000
);

-- Services cho Prewedding Studio BASIC
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000006-0000-0000-0000-000000000001', 'Chụp 1 váy + 1 vest', 1),
('a1000006-0000-0000-0000-000000000001', 'Make up & tóc theo trang phục', 2),
('a1000006-0000-0000-0000-000000000001', 'Hỗ trợ phụ kiện cho Dâu', 3),
('a1000006-0000-0000-0000-000000000001', 'Hỗ trợ tạo dáng', 4),
('a1000006-0000-0000-0000-000000000001', 'Có màn hình follow dáng pose', 5),
('a1000006-0000-0000-0000-000000000001', '1 Ảnh 60x90 tráng gương 4K bo viền SIÊU NÉT', 6),
('a1000006-0000-0000-0000-000000000001', 'Album 20 trang 25x35 (photobook)', 7),
('a1000006-0000-0000-0000-000000000001', 'Hộp đựng album Cao cấp', 8),
('a1000006-0000-0000-0000-000000000001', '35 file chỉnh sửa', 9),
('a1000006-0000-0000-0000-000000000001', '[Tặng] 5 ảnh bàn 15x21', 10);

-- Services cho Prewedding Studio VIP
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000006-0000-0000-0000-000000000002', 'Chụp 1 váy + 1 vest', 1),
('a1000006-0000-0000-0000-000000000002', 'Make up & tóc theo trang phục', 2),
('a1000006-0000-0000-0000-000000000002', 'Hỗ trợ phụ kiện cho Dâu', 3),
('a1000006-0000-0000-0000-000000000002', 'Hỗ trợ tạo dáng', 4),
('a1000006-0000-0000-0000-000000000002', 'Có màn hình follow dáng pose', 5),
('a1000006-0000-0000-0000-000000000002', '2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI', 6),
('a1000006-0000-0000-0000-000000000002', 'Album 30 trang 25x35 (photobook)', 7),
('a1000006-0000-0000-0000-000000000002', 'Hộp đựng album Cao cấp', 8),
('a1000006-0000-0000-0000-000000000002', '45 file chỉnh sửa', 9),
('a1000006-0000-0000-0000-000000000002', '[Tặng] 5 ảnh bàn 15x21', 10);

-- Services cho Prewedding Studio CONCEPT VIP ĐỘC QUYỀN
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000006-0000-0000-0000-000000000003', '1 Concept tự chọn', 1),
('a1000006-0000-0000-0000-000000000003', 'Chụp 2 váy + 2 vest', 2),
('a1000006-0000-0000-0000-000000000003', 'Make up & tóc theo trang phục', 3),
('a1000006-0000-0000-0000-000000000003', 'Hỗ trợ phụ kiện cho Dâu', 4),
('a1000006-0000-0000-0000-000000000003', 'Hỗ trợ tạo dáng', 5),
('a1000006-0000-0000-0000-000000000003', 'Có màn hình follow dáng pose', 6),
('a1000006-0000-0000-0000-000000000003', '2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI', 7),
('a1000006-0000-0000-0000-000000000003', 'Album 30 trang 25x35', 8),
('a1000006-0000-0000-0000-000000000003', 'Hộp đựng album Cao cấp', 9),
('a1000006-0000-0000-0000-000000000003', '50 file chỉnh sửa', 10),
('a1000006-0000-0000-0000-000000000003', '[Tặng] 5 ảnh bàn 15x21', 11);

-- ============================================================
-- NHÓM 7: GÓI CHỤP ẢNH CỔNG TẠI STUDIO
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000007-0000-0000-0000-000000000001',
  'Gói Chụp Ảnh Cổng Tại Studio - 1 HÌNH CỔNG',
  'Chụp 1 váy + 1 vest, Make up & tóc theo trang phục, Hỗ trợ phụ kiện cho Dâu, Hỗ trợ tạo dáng, Có màn hình follow dáng pose. Sản phẩm: 1 Ảnh 60x90 tráng gương 4K bo viền SIÊU NÉT, 15 file chỉnh sửa. Tặng: 5 ảnh bàn 15x21 (tráng gương 4K)',
  2500000
),
(
  'a1000007-0000-0000-0000-000000000002',
  'Gói Chụp Ảnh Cổng Tại Studio - 2 HÌNH CỔNG',
  'Chụp 2 váy + 2 vest, Make up & tóc theo trang phục, Hỗ trợ phụ kiện cho Dâu, Hỗ trợ tạo dáng, Có màn hình follow dáng pose. Sản phẩm: 2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI, 15 file chỉnh sửa. Tặng: 5 ảnh bàn 15x21 (tráng gương 4K)',
  3900000
),
(
  'a1000007-0000-0000-0000-000000000003',
  'Gói Chụp Ảnh Cổng Tại Studio - SETUP CONCEPT VIP ĐỘC QUYỀN',
  '1 Concept tự chọn, Chụp 2 Váy + 2 vest, Make up & tóc theo trang phục, Hỗ trợ phụ kiện cho Dâu, Hỗ trợ tạo dáng, Có màn hình follow dáng pose. Sản phẩm: 1 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI, 22 file chỉnh sửa. Tặng: 10 ảnh bàn 15x21 (tráng gương 4K)',
  5900000
);

-- Services cho Ảnh Cổng Studio 1 HÌNH CỔNG
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000007-0000-0000-0000-000000000001', 'Chụp 1 váy + 1 vest', 1),
('a1000007-0000-0000-0000-000000000001', 'Make up & tóc theo trang phục', 2),
('a1000007-0000-0000-0000-000000000001', 'Hỗ trợ phụ kiện cho Dâu', 3),
('a1000007-0000-0000-0000-000000000001', 'Hỗ trợ tạo dáng', 4),
('a1000007-0000-0000-0000-000000000001', 'Có màn hình follow dáng pose', 5),
('a1000007-0000-0000-0000-000000000001', '1 Ảnh 60x90 tráng gương 4K bo viền SIÊU NÉT', 6),
('a1000007-0000-0000-0000-000000000001', '15 file chỉnh sửa', 7),
('a1000007-0000-0000-0000-000000000001', '[Tặng] 5 ảnh bàn 15x21 tráng gương 4K', 8);

-- Services cho Ảnh Cổng Studio 2 HÌNH CỔNG
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000007-0000-0000-0000-000000000002', 'Chụp 2 váy + 2 vest', 1),
('a1000007-0000-0000-0000-000000000002', 'Make up & tóc theo trang phục', 2),
('a1000007-0000-0000-0000-000000000002', 'Hỗ trợ phụ kiện cho Dâu', 3),
('a1000007-0000-0000-0000-000000000002', 'Hỗ trợ tạo dáng', 4),
('a1000007-0000-0000-0000-000000000002', 'Có màn hình follow dáng pose', 5),
('a1000007-0000-0000-0000-000000000002', '2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI', 6),
('a1000007-0000-0000-0000-000000000002', '15 file chỉnh sửa', 7),
('a1000007-0000-0000-0000-000000000002', '[Tặng] 5 ảnh bàn 15x21 tráng gương 4K', 8);

-- Services cho Ảnh Cổng SETUP CONCEPT VIP ĐỘC QUYỀN
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000007-0000-0000-0000-000000000003', '1 Concept tự chọn', 1),
('a1000007-0000-0000-0000-000000000003', 'Chụp 2 Váy + 2 vest', 2),
('a1000007-0000-0000-0000-000000000003', 'Make up & tóc theo trang phục', 3),
('a1000007-0000-0000-0000-000000000003', 'Hỗ trợ phụ kiện cho Dâu', 4),
('a1000007-0000-0000-0000-000000000003', 'Hỗ trợ tạo dáng', 5),
('a1000007-0000-0000-0000-000000000003', 'Có màn hình follow dáng pose', 6),
('a1000007-0000-0000-0000-000000000003', '1 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI', 7),
('a1000007-0000-0000-0000-000000000003', '22 file chỉnh sửa', 8),
('a1000007-0000-0000-0000-000000000003', '[Tặng] 10 ảnh bàn 15x21 tráng gương 4K', 9);

-- ============================================================
-- NHÓM 8: GÓI CHỤP NGOẠI CẢNH
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000008-0000-0000-0000-000000000001',
  'Gói Chụp Ngoại Cảnh - VŨNG TÀU (3 địa điểm)',
  'Chụp 2 váy + 2 vest, 1 Bộ OUTFIT tự do, Hoa lụa cầm tay, Make up & tóc. Sản phẩm: 1 Album 25x35 (30 trang), 2 Ảnh 60x90 gỗ lụa bo viền SIÊU NÉT. Tặng: 5 Hình nhỏ ép lụa 15x21, Hộp & túi đựng album cao cấp',
  8500000
),
(
  'a1000008-0000-0000-0000-000000000002',
  'Gói Chụp Ngoại Cảnh - ĐÀ LẠT (3 địa điểm)',
  'Chụp 2 váy + 2 vest, 1 Bộ OUTFIT tự do, Hoa lụa cầm tay, Make up & tóc. Sản phẩm: 1 Album 25x35 (30 trang), 2 Ảnh 60x90 gỗ lụa bo viền SIÊU NÉT. Tặng: 5 Hình nhỏ ép lụa 15x21, Hộp & túi đựng album cao cấp',
  12500000
),
(
  'a1000008-0000-0000-0000-000000000003',
  'Gói Chụp Ngoại Cảnh - VĨNH HY (3 địa điểm)',
  'Chụp 2 váy + 2 vest, 1 Bộ OUTFIT tự do, Hoa lụa cầm tay, Make up & tóc. Sản phẩm: 1 Album 25x35 (40 trang), 2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI. Tặng: 5 Hình nhỏ ép lụa 15x21, Hộp & túi đựng album cao cấp',
  17500000
),
(
  'a1000008-0000-0000-0000-000000000004',
  'Gói Chụp Ngoại Cảnh - ĐẢO PHÚ QUÝ (3 địa điểm)',
  'Chụp 2 váy + 2 vest, 1 Bộ OUTFIT tự do, Hoa lụa cầm tay, Make up & tóc. Sản phẩm: 1 Album 25x35 (40 trang), 2 Ảnh 60x90 tráng gương HQ CÔNG NGHỆ MỚI. Tặng: 5 Hình nhỏ ép lụa 15x21, Hộp & túi đựng album cao cấp',
  21500000
);

-- Services cho Ngoại Cảnh VŨNG TÀU
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000008-0000-0000-0000-000000000001', 'Chụp 2 váy + 2 vest', 1),
('a1000008-0000-0000-0000-000000000001', '1 Bộ OUTFIT tự do', 2),
('a1000008-0000-0000-0000-000000000001', 'Hoa lụa cầm tay', 3),
('a1000008-0000-0000-0000-000000000001', 'Make up & tóc', 4),
('a1000008-0000-0000-0000-000000000001', '1 Album 25x35 (30 trang)', 5),
('a1000008-0000-0000-0000-000000000001', '2 Ảnh 60x90 gỗ lụa bo viền SIÊU NÉT', 6),
('a1000008-0000-0000-0000-000000000001', '[Tặng] 5 Hình nhỏ ép lụa 15x21', 7),
('a1000008-0000-0000-0000-000000000001', '[Tặng] Hộp & túi đựng album cao cấp', 8);

-- Services cho Ngoại Cảnh ĐÀ LẠT
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000008-0000-0000-0000-000000000002', 'Chụp 2 váy + 2 vest', 1),
('a1000008-0000-0000-0000-000000000002', '1 Bộ OUTFIT tự do', 2),
('a1000008-0000-0000-0000-000000000002', 'Hoa lụa cầm tay', 3),
('a1000008-0000-0000-0000-000000000002', 'Make up & tóc', 4),
('a1000008-0000-0000-0000-000000000002', '1 Album 25x35 (30 trang)', 5),
('a1000008-0000-0000-0000-000000000002', '2 Ảnh 60x90 gỗ lụa bo viền SIÊU NÉT', 6),
('a1000008-0000-0000-0000-000000000002', '[Tặng] 5 Hình nhỏ ép lụa 15x21', 7),
('a1000008-0000-0000-0000-000000000002', '[Tặng] Hộp & túi đựng album cao cấp', 8);

-- Services cho Ngoại Cảnh VĨNH HY
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000008-0000-0000-0000-000000000003', 'Chụp 2 váy + 2 vest', 1),
('a1000008-0000-0000-0000-000000000003', '1 Bộ OUTFIT tự do', 2),
('a1000008-0000-0000-0000-000000000003', 'Hoa lụa cầm tay', 3),
('a1000008-0000-0000-0000-000000000003', 'Make up & tóc', 4),
('a1000008-0000-0000-0000-000000000003', '1 Album 25x35 (40 trang)', 5),
('a1000008-0000-0000-0000-000000000003', '2 Ảnh 60x90 tráng gương TITAN CÔNG NGHỆ MỚI', 6),
('a1000008-0000-0000-0000-000000000003', '[Tặng] 5 Hình nhỏ ép lụa 15x21', 7),
('a1000008-0000-0000-0000-000000000003', '[Tặng] Hộp & túi đựng album cao cấp', 8);

-- Services cho Ngoại Cảnh ĐẢO PHÚ QUÝ
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000008-0000-0000-0000-000000000004', 'Chụp 2 váy + 2 vest', 1),
('a1000008-0000-0000-0000-000000000004', '1 Bộ OUTFIT tự do', 2),
('a1000008-0000-0000-0000-000000000004', 'Hoa lụa cầm tay', 3),
('a1000008-0000-0000-0000-000000000004', 'Make up & tóc', 4),
('a1000008-0000-0000-0000-000000000004', '1 Album 25x35 (40 trang)', 5),
('a1000008-0000-0000-0000-000000000004', '2 Ảnh 60x90 tráng gương HQ CÔNG NGHỆ MỚI', 6),
('a1000008-0000-0000-0000-000000000004', '[Tặng] 5 Hình nhỏ ép lụa 15x21', 7),
('a1000008-0000-0000-0000-000000000004', '[Tặng] Hộp & túi đựng album cao cấp', 8);

-- ============================================================
-- NHÓM 9: TRỌN GÓI NGÀY ĂN HỎI
-- ============================================================

INSERT INTO public.wedding_combos (id, name, description, base_price) VALUES
(
  'a1000009-0000-0000-0000-000000000001',
  'Trọn Gói Ngày Ăn Hỏi - ĐÍNH HÔN 1',
  '1 Áo dài cô dâu Classic, 1 Bộ áo dài hoặc Vest rể, 4-6 bộ áo phụ dâu hoặc phụ rể',
  1700000
),
(
  'a1000009-0000-0000-0000-000000000002',
  'Trọn Gói Ngày Ăn Hỏi - ĐÍNH HÔN 2',
  '1 Áo dài cô dâu Luxury, 1 Bộ Vest hoặc Áo dài chú rể, 1 Lần trang điểm cô dâu tại HARMONY WEDDING, 1 Máy chụp hình truyền thống giao toàn bộ file, Set áo dài bưng quả (6 bộ) nam hoặc nữ',
  5900000
),
(
  'a1000009-0000-0000-0000-000000000003',
  'Trọn Gói Ngày Ăn Hỏi - BÁO HỶ',
  '1 Áo dài cô dâu, 1 Váy đón khách, 1 Bộ Vest hoặc Áo dài chú rể, 1 Lần trang điểm cô dâu tại nhà, 1 Máy chụp hình phóng sự lai. Tặng: 1 bó hoa tươi cầm tay. Set áo dài bưng quả (6 bộ) nữ, Phụ kiện bưng quả nam (nơ/cà vạt)',
  7500000
);

-- Services cho Ăn Hỏi ĐÍNH HÔN 1
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000009-0000-0000-0000-000000000001', '1 Áo dài cô dâu Classic', 1),
('a1000009-0000-0000-0000-000000000001', '1 Bộ áo dài hoặc Vest rể', 2),
('a1000009-0000-0000-0000-000000000001', '4-6 bộ áo phụ dâu hoặc phụ rể', 3);

-- Services cho Ăn Hỏi ĐÍNH HÔN 2
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000009-0000-0000-0000-000000000002', '1 Áo dài cô dâu Luxury', 1),
('a1000009-0000-0000-0000-000000000002', '1 Bộ Vest hoặc Áo dài chú rể', 2),
('a1000009-0000-0000-0000-000000000002', '1 Lần trang điểm cô dâu tại HARMONY WEDDING', 3),
('a1000009-0000-0000-0000-000000000002', '1 Máy chụp hình truyền thống - giao toàn bộ file', 4),
('a1000009-0000-0000-0000-000000000002', 'Set áo dài bưng quả (6 bộ) nam hoặc nữ', 5);

-- Services cho Ăn Hỏi BÁO HỶ
INSERT INTO public.wedding_combo_services (combo_id, name, sort_order) VALUES
('a1000009-0000-0000-0000-000000000003', '1 Áo dài cô dâu', 1),
('a1000009-0000-0000-0000-000000000003', '1 Váy đón khách', 2),
('a1000009-0000-0000-0000-000000000003', '1 Bộ Vest hoặc Áo dài chú rể', 3),
('a1000009-0000-0000-0000-000000000003', '1 Lần trang điểm cô dâu tại nhà', 4),
('a1000009-0000-0000-0000-000000000003', '1 Máy chụp hình phóng sự lai', 5),
('a1000009-0000-0000-0000-000000000003', '[Tặng] 1 bó hoa tươi cầm tay', 6),
('a1000009-0000-0000-0000-000000000003', 'Set áo dài bưng quả (6 bộ) nữ', 7),
('a1000009-0000-0000-0000-000000000003', 'Phụ kiện bưng quả nam (nơ/cà vạt)', 8);