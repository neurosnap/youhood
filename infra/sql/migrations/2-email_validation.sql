SET client_encoding = 'UTF8';

ALTER TABLE hood_user
ADD COLUMN is_active boolean DEFAULT true,
ADD COLUMN validated boolean DEFAULT false;

CREATE TABLE email_validation (
    id bigserial NOT NULL,
    hood_user_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT NOW(),
    CONSTRAINT fk_point_hood_user
        foreign key (hood_user_id)
        REFERENCES hood_user (id)
);

ALTER TABLE email_validation OWNER TO postgres;
