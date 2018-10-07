SET client_encoding = 'UTF8';

CREATE TABLE point (
    id bigserial NOT NULL,
    hood_user_id uuid NOT NULL,
    neighborhood_id uuid,
    reason character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT NOW(),
    CONSTRAINT point_pkey PRIMARY KEY (id),
    CONSTRAINT fk_point_hood_user
        foreign key (hood_user_id)
        REFERENCES hood_user (id),
    CONSTRAINT fk_point_neighborhood
        foreign key (neighborhood_id)
        REFERENCES neighborhood (id)
);

ALTER TABLE point OWNER TO postgres;
