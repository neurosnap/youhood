SET client_encoding = 'UTF8';

CREATE TABLE api_keys (
    id bigserial NOT NULL,
    hood_user_id uuid NOT NULL,
    api_key character varying(255) NOT NULL,
    is_valid boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT NOW(),
    CONSTRAINT fk_point_hood_user
        foreign key (hood_user_id)
        REFERENCES hood_user (id)
);

ALTER TABLE api_keys OWNER TO postgres;
