--1
SELECT SUM(value)/1024/1024 FROM v$sga;
--2
SELECT POOL, SUM(BYTES)/1024/1024 
FROM v$sgastat
group by pool;
--3
SELECT COMPONENT, GRANULE_SIZE, MAX_SIZE, CURRENT_SIZE 
FROM v$sga_dynamic_components
where current_size > 0;
--4
SELECT CURRENT_SIZE 
FROM v$sga_dynamic_free_memory;
--5
select value from v$parameter where name = 'sga_target';
select value from v$parameter where name = 'sga_max_size';

--6
SELECT COMPONENT, GRANULE_SIZE, MAX_SIZE, CURRENT_SIZE 
FROM v$sga_dynamic_components WHERE component LIKE '%buffer cache%';
--7
CREATE TABLE keep_table (
    id NUMBER PRIMARY KEY
) STORAGE (BUFFER_POOL KEEP);

SELECT SEGMENT_NAME, SEGMENT_TYPE, TABLESPACE_NAME, BUFFER_POOL 
FROM dba_segments
WHERE SEGMENT_NAME = 'KEEP_TABLE';
--8
CREATE TABLE my_default_table (
    id NUMBER PRIMARY KEY
) STORAGE (BUFFER_POOL DEFAULT);
SELECT SEGMENT_NAME, SEGMENT_TYPE, TABLESPACE_NAME, BUFFER_POOL 
FROM dba_segments
WHERE SEGMENT_NAME = 'MY_DEFAULT_TABLE';

--9
SELECT name, value AS size_mb
FROM v$parameter 
WHERE name = 'log_buffer';
--10
SELECT 
    pool,
    name,
    bytes AS free_memory_mb
FROM v$sgastat 
WHERE pool = 'large pool' 
AND name = 'free memory';

--11
SELECT 
    sid,
    username,
    program,
    server AS connection_mode,
    status
FROM v$session 
WHERE type = 'USER'
ORDER BY server, username;
--12
SELECT NAME, DESCRIPTION 
FROM v$bgprocess
WHERE PADDR IS NOT NULL order by name;
--13
SELECT SPID, PROGRAM 
FROM v$process
WHERE BACKGROUND IS NULL;
--14
SELECT COUNT(*) 
FROM v$process
WHERE PROGRAM LIKE '%DBW%';
--15
SELECT NAME 
FROM v$active_services;
--16
SELECT name, value , description
FROM v$parameter
WHERE name LIKE 'dispatchers%';
--20 lsnrctl services