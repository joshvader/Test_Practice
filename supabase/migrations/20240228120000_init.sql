-- Create tables
CREATE TABLE IF NOT EXISTS practicantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practicante_id UUID REFERENCES practicantes(id),
  puntuacion_total INTEGER NOT NULL CHECK (puntuacion_total >= 0 AND puntuacion_total <= 100),
  tiempo_minutos INTEGER NOT NULL,
  respuestas_completas JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_practicantes_email ON practicantes(email);
CREATE INDEX IF NOT EXISTS idx_practicantes_created_at ON practicantes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_practicante ON test_results(practicante_id);
CREATE INDEX IF NOT EXISTS idx_test_results_completed ON test_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_puntuacion ON test_results(puntuacion_total DESC);

-- Grant permissions
-- Granting SELECT to anon allows public read access if needed (e.g. for checking email existence)
GRANT SELECT ON practicantes TO anon;
GRANT ALL PRIVILEGES ON practicantes TO authenticated;
GRANT SELECT ON test_results TO anon;
GRANT ALL PRIVILEGES ON test_results TO authenticated;

-- Allow anon to insert (since registration is public)
GRANT INSERT ON practicantes TO anon;
GRANT INSERT ON test_results TO anon;
