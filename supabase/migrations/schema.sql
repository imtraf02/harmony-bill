-- Create master_packages table
CREATE TABLE IF NOT EXISTS public.master_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contracts table
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contract_packages table
CREATE TABLE IF NOT EXISTS public.contract_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.master_packages(id) ON DELETE SET NULL,
    label TEXT NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.master_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_packages ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for now as it's a simple app)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public full access' AND tablename = 'master_packages') THEN
        CREATE POLICY "Public full access" ON public.master_packages FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public full access' AND tablename = 'contracts') THEN
        CREATE POLICY "Public full access" ON public.contracts FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public full access' AND tablename = 'contract_packages') THEN
        CREATE POLICY "Public full access" ON public.contract_packages FOR ALL USING (true);
    END IF;
END $$;

-- Insert some sample packages if empty
INSERT INTO public.master_packages (label, price)
SELECT * FROM (VALUES 
    ('Gói Chụp Phóng Sự 1 Máy', 3000000),
    ('Gói Chụp Phóng Sự 2 Máy', 5000000),
    ('Gói Quay Phóng Sự', 4000000),
    ('Gói Chụp Truyền Thống', 2000000)
) AS t(label, price)
WHERE NOT EXISTS (SELECT 1 FROM public.master_packages);
