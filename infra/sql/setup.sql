SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = public, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;

CREATE TABLE hood_user (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    passhash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT NOW(),
    is_tmp boolean DEFAULT false,
    is_active boolean DEFAULT true,
    validated boolean DEFAULT false,
    CONSTRAINT hood_user_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email)
);

ALTER TABLE hood_user OWNER TO postgres;

CREATE TABLE neighborhood (
    id uuid NOT NULL,
    hood_user_id uuid NOT NULL,
    state character varying(255) NOT NULL,
    county character varying(255),
    city character varying(255) NOT NULL,
    country character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT NOW(),
    updated_at timestamp without time zone DEFAULT NOW(),
    data jsonb,
    geom geometry(Multipolygon),
    CONSTRAINT neighborhood_pkey PRIMARY KEY (id),
    CONSTRAINT fk_neighborhood_hood_user
        foreign key (hood_user_id)
        REFERENCES hood_user (id)
        ON DELETE CASCADE
);

ALTER TABLE neighborhood OWNER TO postgres;
CREATE INDEX neighborhood_city_key ON neighborhood USING btree(city);
CREATE INDEX neighborhood_state_key ON neighborhood USING btree(state);

CREATE TABLE vote (
    id bigserial NOT NULL,
    hood_user_id uuid NOT NULL,
    neighborhood_id uuid NOT NULL,
    vote smallint,
    created_at timestamp without time zone DEFAULT NOW(),
    CONSTRAINT vote_pkey PRIMARY KEY (id),
    CONSTRAINT fk_vote_neighborhood
        foreign key (neighborhood_id)
        REFERENCES neighborhood (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_vote_hood_user
        foreign key (hood_user_id)
        REFERENCES hood_user (id)
        ON DELETE CASCADE
);

ALTER TABLE vote OWNER TO postgres;

CREATE TABLE point (
    id bigserial NOT NULL,
    hood_user_id uuid NOT NULL,
    neighborhood_id uuid,
    reason character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT NOW(),
    CONSTRAINT point_pkey PRIMARY KEY (id),
    CONSTRAINT fk_point_hood_user
        foreign key (hood_user_id)
        REFERENCES hood_user (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_point_neighborhood
        foreign key (neighborhood_id)
        REFERENCES neighborhood (id)
        ON DELETE CASCADE
);

ALTER TABLE point OWNER TO postgres;

CREATE TABLE api_keys (
    id bigserial NOT NULL,
    hood_user_id uuid NOT NULL,
    api_key character varying(255) NOT NULL,
    label character varying(255),
    is_valid boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT NOW(),
    CONSTRAINT fk_point_hood_user
        foreign key (hood_user_id)
        REFERENCES hood_user (id)
        ON DELETE CASCADE
);

ALTER TABLE api_keys OWNER TO postgres;

CREATE TABLE email_validation (
    id bigserial NOT NULL,
    hood_user_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT NOW(),
    CONSTRAINT fk_point_hood_user
        foreign key (hood_user_id)
        REFERENCES hood_user (id)
        ON DELETE CASCADE
);

ALTER TABLE email_validation OWNER TO postgres;
