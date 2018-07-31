#!/bin/bash
set -x

now="$(date +'%d-%m-%Y')"
echo "Today data: $now"
docker exec -it -e PGPASSWORD="" youhood_db_1 pg_dump postgres -U postgres > backup.sql
tar -zcvf backup_$now.tar.gz backup.sql
gsutil cp backup_$now.tar.gz gs://youhood-backups
rm backup.sql
rm backup_$now.tar.gz
