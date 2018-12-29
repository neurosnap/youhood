SET client_encoding = 'UTF8';

ALTER TABLE api_keys ADD COLUMN label character varying(255);
