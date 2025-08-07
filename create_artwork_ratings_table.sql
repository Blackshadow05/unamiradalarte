-- Crear tabla artwork_ratings
CREATE TABLE public.artwork_ratings (
    id SERIAL NOT NULL,
    artwork_id CHARACTER VARYING(50) NOT NULL,
    user_name CHARACTER VARYING(100) NULL,
    user_email CHARACTER VARYING(255) NULL,
    rating INTEGER NOT NULL,
    comment TEXT NULL,
    verified BOOLEAN NULL DEFAULT false,
    ip_address INET NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
    CONSTRAINT artwork_ratings_pkey PRIMARY KEY (id),
    CONSTRAINT artwork_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
) TABLESPACE pg_default;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_artwork_ratings_artwork_id ON public.artwork_ratings USING btree (artwork_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_artwork_ratings_rating ON public.artwork_ratings USING btree (rating) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_artwork_ratings_verified ON public.artwork_ratings USING btree (verified) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_artwork_ratings_created_at ON public.artwork_ratings USING btree (created_at) TABLESPACE pg_default;

-- Crear función para actualizar updated_at (si no existe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para updated_at
CREATE TRIGGER update_artwork_ratings_updated_at 
    BEFORE UPDATE ON public.artwork_ratings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Configurar Row Level Security (RLS)
ALTER TABLE public.artwork_ratings ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos
CREATE POLICY "Allow public read access" ON public.artwork_ratings
    FOR SELECT USING (true);

-- Política para permitir inserción a todos (puedes restringir esto más tarde)
CREATE POLICY "Allow public insert access" ON public.artwork_ratings
    FOR INSERT WITH CHECK (true);

-- Política para permitir actualización solo del propietario (opcional)
CREATE POLICY "Allow update own ratings" ON public.artwork_ratings
    FOR UPDATE USING (true);

-- Política para permitir eliminación solo del propietario (opcional)
CREATE POLICY "Allow delete own ratings" ON public.artwork_ratings
    FOR DELETE USING (true);