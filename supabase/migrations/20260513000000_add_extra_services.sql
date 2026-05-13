-- Migration: Add wedding extra services tables

CREATE TABLE IF NOT EXISTS public.wedding_extra_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wedding_contract_extra_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.wedding_contracts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.wedding_extra_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_contract_extra_services ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies (Allow all for now as per project pattern)
CREATE POLICY "Allow all for wedding_extra_services" ON public.wedding_extra_services FOR ALL USING (true);
CREATE POLICY "Allow all for wedding_contract_extra_services" ON public.wedding_contract_extra_services FOR ALL USING (true);

-- Add some seed data for wedding_extra_services
INSERT INTO public.wedding_extra_services (category, name, price, sort_order) VALUES
('Trang phục', 'Veston rể cao cấp', 600000, 1),
('Trang phục', 'Veston ông sui', 500000, 2),
('Trang phục', 'Váy Diamond', 1550000, 3),
('Trang phục', 'Váy Ruby', 1850000, 4),
('Trang phục', 'Váy Signature', 2250000, 5),
('Trang phục', 'Áo dài chú rể', 500000, 6),
('Trang phục', 'Áo dài cô dâu', 600000, 7),
('Trang phục', 'Áo dài bà sui', 600000, 8),
('Trang phục', 'Áo dài bưng quả', 100000, 9),
('Trang phục', 'Set 6 áo dài bưng quả', 550000, 10),
('Trang phục', 'Set 12 áo dài bưng quả', 1100000, 11),
('Makeup & Chụp tiệc', 'Makeup tiệc', 300000, 12),
('Makeup & Chụp tiệc', 'Makeup sui (tại tiệm)', 500000, 13),
('Makeup & Chụp tiệc', 'Makeup sui (tại nhà)', 700000, 14),
('Makeup & Chụp tiệc', 'Dặm makeup', 500000, 15),
('Makeup & Chụp tiệc', 'Makeup cô dâu (tại tiệm)', 1500000, 16),
('Makeup & Chụp tiệc', 'Makeup cô dâu (tại nhà)', 2000000, 17),
('Makeup & Chụp tiệc', 'Chỉnh sửa thêm hình', 20000, 18),
('Makeup & Chụp tiệc', 'Chụp thêm 1 váy', 500000, 19),
('Makeup & Chụp tiệc', 'Áo ghi-lê', 200000, 20),
('Phụ thu / Hỗ trợ', 'Hủy phục', 3500000, 21),

-- Rửa Album
('Rửa Album', 'Album chống trầy 15×21 (20 trang) - Hộp bìa gói', 650000, 30),
('Rửa Album', 'Album tráng gương 15×21 (30 trang) - Hộp mica', 950000, 31),
('Rửa Album', 'Album chống trầy 20×20 (20 trang) - Hộp bìa gói', 650000, 32),
('Rửa Album', 'Album tráng gương 20×20 (30 trang) - Hộp mica', 950000, 33),
('Rửa Album', 'Album chống trầy 20×30 (20 trang) - Hộp bìa gói', 1150000, 34),
('Rửa Album', 'Album tráng gương 20×30 (30 trang) - Hộp mica', 1550000, 35),
('Rửa Album', 'Album chống trầy 25×35 (20 trang) - Hộp bìa gói', 1500000, 36),
('Rửa Album', 'Album tráng gương 25×35 (30 trang) - Hộp mica', 1850000, 37),
('Rửa Album', 'Album chống trầy 30×30 (20 trang) - Hộp bìa gói', 1500000, 38),
('Rửa Album', 'Album tráng gương 30×30 (30 trang) - Hộp mica', 1850000, 39),
('Rửa Album', 'Thêm tờ (2 trang)', 100000, 40),

-- Rửa Hình Lớn
('Rửa Hình Lớn', 'Ép gỗ 40×60', 390000, 50),
('Rửa Hình Lớn', 'Ép gỗ viền mạ crom 40×60', 450000, 51),
('Rửa Hình Lớn', 'Ép gỗ khung nhôm TITAN 4K 40×60', 490000, 52),
('Rửa Hình Lớn', 'Ép gỗ 50×75', 450000, 53),
('Rửa Hình Lớn', 'Ép gỗ viền mạ crom 50×75', 490000, 54),
('Rửa Hình Lớn', 'Ép gỗ khung nhôm TITAN 4K 50×75', 550000, 55),
('Rửa Hình Lớn', 'Ép gỗ 60×90', 490000, 56),
('Rửa Hình Lớn', 'Ép gỗ viền mạ crom 60×90', 600000, 57),
('Rửa Hình Lớn', 'Ép gỗ khung nhôm TITAN 4K 60×90', 690000, 58),
('Rửa Hình Lớn', 'Ép gỗ 60×120', 490000, 59),
('Rửa Hình Lớn', 'Ép gỗ viền mạ crom 60×120', 690000, 60),
('Rửa Hình Lớn', 'Ép gỗ khung nhôm TITAN 4K 60×120', 890000, 61),
('Rửa Hình Lớn', 'Ép gỗ 70×110', 690000, 62),
('Rửa Hình Lớn', 'Ép gỗ viền mạ crom 70×110', 990000, 63),
('Rửa Hình Lớn', 'Ép gỗ khung nhôm TITAN 4K 70×110', 1190000, 64),

-- Rửa Hình Nhỏ
('Rửa Hình Nhỏ', 'Ép gỗ 13×18', 40000, 70),
('Rửa Hình Nhỏ', 'Ép gỗ viền mạ crom 13×18', 55000, 71),
('Rửa Hình Nhỏ', 'Ép gỗ khung nhôm TITAN 4K 13×18', 69000, 72),
('Rửa Hình Nhỏ', 'Ép gỗ 15×21', 49000, 73),
('Rửa Hình Nhỏ', 'Ép gỗ viền mạ crom 15×21', 59000, 74),
('Rửa Hình Nhỏ', 'Ép gỗ khung nhôm TITAN 4K 15×21', 75000, 75),
('Rửa Hình Nhỏ', 'Ép gỗ 25×35', 45000, 76),
('Rửa Hình Nhỏ', 'Ép gỗ viền mạ crom 25×35', 65000, 77),
('Rửa Hình Nhỏ', 'Ép gỗ khung nhôm TITAN 4K 25×35', 75000, 78),
('Rửa Hình Nhỏ', 'Ép lụa 13×18', 7000, 79),
('Rửa Hình Nhỏ', 'Ép lụa 15×21', 10000, 80),
('Rửa Hình Nhỏ', 'Ép lụa 25×35', 15000, 81);
