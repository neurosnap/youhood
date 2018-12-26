SET client_encoding = 'UTF8';

CREATE INDEX neighborhood_city_key ON neighborhood USING btree(city);
CREATE INDEX neighborhood_state_key ON neighborhood USING btree(state);
