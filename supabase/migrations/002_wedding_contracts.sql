-- 1. Master tables for templates
CREATE TABLE IF NOT EXISTS public.wedding_combos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    base_price NUMERIC, -- This can be a reference price or sum of services
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wedding_combo_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    combo_id UUID NOT NULL REFERENCES public.wedding_combos(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Transactional tables for contracts
CREATE TABLE IF NOT EXISTS public.wedding_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    wedding_date TIMESTAMPTZ NOT NULL,
    travel_fee NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    include_vat BOOLEAN NOT NULL DEFAULT FALSE,
    deposit NUMERIC NOT NULL DEFAULT 0,
    pickup_date TIMESTAMPTZ NOT NULL,
    contract_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wedding_contract_combos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.wedding_contracts(id) ON DELETE CASCADE,
    combo_id UUID REFERENCES public.wedding_combos(id) ON DELETE SET NULL,
    combo_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wedding_contract_combo_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_combo_id UUID NOT NULL REFERENCES public.wedding_contract_combos(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    is_removed BOOLEAN NOT NULL DEFAULT FALSE,
    note TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.wedding_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_combo_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_contract_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_contract_combo_services ENABLE ROW LEVEL SECURITY;

-- Create policies (Public full access for now)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public full access' AND tablename = 'wedding_combos') THEN
        CREATE POLICY "Public full access" ON public.wedding_combos FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public full access' AND tablename = 'wedding_combo_services') THEN
        CREATE POLICY "Public full access" ON public.wedding_combo_services FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public full access' AND tablename = 'wedding_contracts') THEN
        CREATE POLICY "Public full access" ON public.wedding_contracts FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public full access' AND tablename = 'wedding_contract_combos') THEN
        CREATE POLICY "Public full access" ON public.wedding_contract_combos FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public full access' AND tablename = 'wedding_contract_combo_services') THEN
        CREATE POLICY "Public full access" ON public.wedding_contract_combo_services FOR ALL USING (true);
    END IF;
END $$;

-- Insert some sample wedding combos
DO $$
DECLARE
    combo_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.wedding_combos) THEN
        INSERT INTO public.wedding_combos (name, description, base_price)
        VALUES ('Trọn gói Vàng', 'Gói chụp và quay phim cơ bản cho ngày cưới', 15000000)
        RETURNING id INTO combo_id;

        INSERT INTO public.wedding_combo_services (combo_id, name, price, sort_order)
        VALUES 
            (combo_id, 'Chụp phóng sự sáng chiều', 5000000, 1),
            (combo_id, 'Quay phim phóng sự 1 máy', 4000000, 2),
            (combo_id, 'Album 20x30 20 trang', 3000000, 3),
            (combo_id, 'Ảnh cổng 60x90', 1500000, 4),
            (combo_id, 'Xe hoa trang trí', 1500000, 5);

        INSERT INTO public.wedding_combos (name, description, base_price)
        VALUES ('Trọn gói Bạch Kim', 'Gói chụp và quay phim cao cấp nhất', 25000000)
        RETURNING id INTO combo_id;

        INSERT INTO public.wedding_combo_services (combo_id, name, price, sort_order)
        VALUES 
            (combo_id, 'Chụp phóng sự 2 máy', 8000000, 1),
            (combo_id, 'Quay phim phóng sự 2 máy', 8000000, 2),
            (combo_id, 'Flycam quay phim', 3000000, 3),
            (combo_id, 'Album 30x40 30 trang', 4500000, 4),
            (combo_id, '2 Ảnh cổng 60x90', 3000000, 5);
    END IF;
END $$;
