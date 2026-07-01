-- Enable PostGIS on template1 database so all dynamically created databases (like shadow databases) inherit it
\c template1
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable PostGIS on the default database
\c ikli
CREATE EXTENSION IF NOT EXISTS postgis;
