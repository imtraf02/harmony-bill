-- Create settings table
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

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Public full access" ON public.settings FOR ALL USING (true);

-- Insert default row
INSERT INTO public.settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;
