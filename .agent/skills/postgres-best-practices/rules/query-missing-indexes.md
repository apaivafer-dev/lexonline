# Finding tables with missing indexes

This SQL query helps identify tables that have a high number of sequential scans but low index usage.

```sql
SELECT
  relname AS table_name,
  seq_scan,
  idx_scan,
  n_live_tup AS estimate_rows
FROM
  pg_stat_user_tables
WHERE
  seq_scan > 1000
  AND (idx_scan = 0 OR (seq_scan / NULLIF(idx_scan, 0)) > 10)
ORDER BY
  seq_scan DESC;
```
