-- 1. Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    studio_name TEXT DEFAULT 'HARMONY MEDIA',
    address TEXT DEFAULT 'Hòa Bình, Đông Hoà, Trảng Bom, Đồng Nai.',
    email TEXT DEFAULT 'Studiohieutrancanon@gmail.com',
    phone TEXT DEFAULT '0388.660.678',
    bank_accounts JSONB DEFAULT '[{"bank": "Sacombank", "account": "050096596674", "owner": "TRẦN QUỐC HIẾU"}, {"bank": "MBBank", "account": "0388660678", "owner": "TRẦN QUỐC HIẾU"}]',
    background_url TEXT DEFAULT '/images/bg.jpg',
    signature_url TEXT DEFAULT '/images/sig.png',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Master packages for basic contracts
CREATE TABLE IF NOT EXISTS public.master_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Basic contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    wedding_date_start TIMESTAMPTZ NOT NULL,
    wedding_date_end TIMESTAMPTZ NOT NULL,
    travel_fee NUMERIC NOT NULL DEFAULT 0,
    benefits TEXT,
    deposit NUMERIC NOT NULL DEFAULT 0,
    pickup_date TIMESTAMPTZ NOT NULL,
    contract_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    discount NUMERIC NOT NULL DEFAULT 0,
    include_vat BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contract packages link table
CREATE TABLE IF NOT EXISTS public.contract_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.master_packages(id) ON DELETE SET NULL,
    label TEXT NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Master tables for wedding combos
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

-- 6. Wedding contracts table
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

-- Enable RLS on all tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_combo_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_contract_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_contract_combo_services ENABLE ROW LEVEL SECURITY;

