--2
--connect /as sysdba connect system/505754@localhost:1521/orcl
--SHOW PARAMETRS;
--3 sqlplus system@//localhost:1521/GAA_PBD 
--system 505754
--select tablespace_name from dba_tablespaces
--select tablespace_name, file_name from dba_data_files
--select role from dba_roles
--select username from dba_users
--4
--5
--6sqlplus "C##GAACORE@//localhost:1521/orcl"sqlplus 505754
--7 select * from departments
--8 HELP TIMING
--SET TIMING ON
--TIMING SHOW
--9 DESCRIBE departments
--10 SELECT segment_name, segment_type, tablespace_name FROM user_segments;

CREATE VIEW segment_info AS
SELECT 
    segment_name,
    segment_type,
    COUNT(segment_name) AS segment_count,
    SUM(extents) AS extent_count,
    SUM(blocks) AS block_count,
    SUM(bytes) / 1024 AS size_kb
FROM 
    dba_segments
GROUP BY 
    segment_name,
    segment_type;
    
SELECT * FROM segment_info;
