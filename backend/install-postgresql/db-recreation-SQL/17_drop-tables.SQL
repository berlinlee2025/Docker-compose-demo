CREATE OR REPLACE FUNCTION drop_all_tables() RETURNS void AS $$
DECLARE
    statement TEXT;
BEGIN
    FOR statement IN
        SELECT 'DROP TABLE IF EXISTS "' || tablename || '" CASCADE;'
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE statement;
    END LOOP;
END;
$$ LANGUAGE plpgsql;