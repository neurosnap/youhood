SET client_encoding = 'UTF8';

ALTER TABLE vote ADD COLUMN vote smallint;

UPDATE vote SET vote=1 WHERE vote_type='upvote';
UPDATE vote SET vote=-1 WHERE vote_type='downvote';

ALTER TABLE vote DROP COLUMN vote_type;
