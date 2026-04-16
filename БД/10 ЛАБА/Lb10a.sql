--1
select status from v$instance;
alter database open;
-- Под SYS
SELECT owner, table_name
FROM all_tables
WHERE table_name = 'TEACHER';

GRANT SELECT, INSERT, UPDATE, DELETE, ALTER ON SYS.TEACHER TO SYS;

alter table SYS.TEACHER add BIRTHDAY DATE;
alter table SYS.TEACHER add SALARY NUMBER;

select * from SYS.TEACHER;

UPDATE TEACHER SET BIRTHDAY = '12-02-1959' WHERE TEACHER = 'СМЛВ';
UPDATE TEACHER SET BIRTHDAY = '30-01-1987' WHERE TEACHER = 'АКНВЧ';
UPDATE TEACHER SET BIRTHDAY = '19-04-1991' WHERE TEACHER = 'КЛСНВ';
UPDATE TEACHER SET BIRTHDAY = '16-04-1964' WHERE TEACHER = 'ГРМН';
UPDATE TEACHER SET BIRTHDAY = '19-11-1988' WHERE TEACHER = 'ЛЩНК';
UPDATE TEACHER SET BIRTHDAY = '05-10-1966' WHERE TEACHER = 'БРКВЧ';
UPDATE TEACHER SET BIRTHDAY = '10-08-1976' WHERE TEACHER = 'ДДК';
UPDATE TEACHER SET BIRTHDAY = '11-09-1989' WHERE TEACHER = 'КБЛ';
UPDATE TEACHER SET BIRTHDAY = '24-12-1983' WHERE TEACHER = 'УРБ';
UPDATE TEACHER SET BIRTHDAY = '03-06-1990' WHERE TEACHER = 'РМНК';
UPDATE TEACHER SET BIRTHDAY = '10-05-1970' WHERE TEACHER = 'ПСТВЛВ';
UPDATE TEACHER SET BIRTHDAY = '26-10-1999' WHERE TEACHER = '?';
UPDATE TEACHER SET BIRTHDAY = '30-07-1984' WHERE TEACHER = 'ГРН';
UPDATE TEACHER SET BIRTHDAY = '11-03-1975' WHERE TEACHER = 'ЖЛК';
UPDATE TEACHER SET BIRTHDAY = '12-07-1969' WHERE TEACHER = 'БРТШВЧ';
UPDATE TEACHER SET BIRTHDAY = '26-02-1983' WHERE TEACHER = 'ЮДНКВ';
UPDATE TEACHER SET BIRTHDAY = '13-12-1991' WHERE TEACHER = 'БРНВСК';
UPDATE TEACHER SET BIRTHDAY = '20-01-1968' WHERE TEACHER = 'НВРВ';
UPDATE TEACHER SET BIRTHDAY = '21-12-1969' WHERE TEACHER = 'РВКЧ';
UPDATE TEACHER SET BIRTHDAY = '28-01-1975' WHERE TEACHER = 'ДМДК';
UPDATE TEACHER SET BIRTHDAY = '10-07-1983' WHERE TEACHER = 'МШКВСК';
UPDATE TEACHER SET BIRTHDAY = '08-10-1988' WHERE TEACHER = 'ЛБХ';
UPDATE TEACHER SET BIRTHDAY = '30-07-1984' WHERE TEACHER = 'ЗВГЦВ';
UPDATE TEACHER SET BIRTHDAY = '16-04-1964' WHERE TEACHER = 'БЗБРДВ';
UPDATE TEACHER SET BIRTHDAY = '12-05-1985' WHERE TEACHER = 'ПРКПЧК';
UPDATE TEACHER SET BIRTHDAY = '20-10-1980' WHERE TEACHER = 'НСКВЦ';
UPDATE TEACHER SET BIRTHDAY = '21-08-1990' WHERE TEACHER = 'МХВ';
UPDATE TEACHER SET BIRTHDAY = '13-08-1966' WHERE TEACHER = 'ЕЩНК';
UPDATE TEACHER SET BIRTHDAY = '11-11-1978' WHERE TEACHER = 'ЖРСК';

UPDATE TEACHER SET SALARY = 1030 WHERE TEACHER = 'СМЛВ';
UPDATE TEACHER SET SALARY = 1030 WHERE TEACHER = 'АКНВЧ';
UPDATE TEACHER SET SALARY = 980 WHERE TEACHER = 'КЛСНВ';
UPDATE TEACHER SET SALARY = 1050 WHERE TEACHER = 'ГРМН';
UPDATE TEACHER SET SALARY = 590 WHERE TEACHER = 'ЛЩНК';
UPDATE TEACHER SET SALARY = 870 WHERE TEACHER = 'БРКВЧ';
UPDATE TEACHER SET SALARY = 815 WHERE TEACHER = 'ДДК';
UPDATE TEACHER SET SALARY = 995 WHERE TEACHER = 'КБЛ';
UPDATE TEACHER SET SALARY = 1460 WHERE TEACHER = 'УРБ';
UPDATE TEACHER SET SALARY = 1120 WHERE TEACHER = 'РМНК';
UPDATE TEACHER SET SALARY = 1250 WHERE TEACHER = 'ПСТВЛВ';
UPDATE TEACHER SET SALARY = 333 WHERE TEACHER = '?';
UPDATE TEACHER SET SALARY = 1520 WHERE TEACHER = 'ГРН';
UPDATE TEACHER SET SALARY = 1430 WHERE TEACHER = 'ЖЛК';
UPDATE TEACHER SET SALARY = 900 WHERE TEACHER = 'БРТШВЧ';
UPDATE TEACHER SET SALARY = 875 WHERE TEACHER = 'ЮДНКВ';
UPDATE TEACHER SET SALARY = 970 WHERE TEACHER = 'БРНВСК';
UPDATE TEACHER SET SALARY = 780 WHERE TEACHER = 'НВРВ';
UPDATE TEACHER SET SALARY = 1150 WHERE TEACHER = 'РВКЧ';
UPDATE TEACHER SET SALARY = 805 WHERE TEACHER = 'ДМДК';
UPDATE TEACHER SET SALARY = 905 WHERE TEACHER = 'МШКВСК';
UPDATE TEACHER SET SALARY = 1200 WHERE TEACHER = 'ЛБХ';
UPDATE TEACHER SET SALARY = 1500 WHERE TEACHER = 'ЗВГЦВ';
UPDATE TEACHER SET SALARY = 905 WHERE TEACHER = 'БЗБРДВ';
UPDATE TEACHER SET SALARY = 715 WHERE TEACHER = 'ПРКПЧК';
UPDATE TEACHER SET SALARY = 880 WHERE TEACHER = 'НСКВЦ';
UPDATE TEACHER SET SALARY = 735 WHERE TEACHER = 'МХВ';
UPDATE TEACHER SET SALARY = 595 WHERE TEACHER = 'ЕЩНК';
UPDATE TEACHER SET SALARY = 850 WHERE TEACHER = 'ЖРСК';
--2. Получите список преподавателей в виде Фамилия И.О.
select regexp_substr(teacher_name, '(\S+)', 1, 1) || ' ' || substr(regexp_substr(teacher_name, '(\S+)', 1, 2), 1, 1) || '. ' || substr(regexp_substr(teacher_name, '(\S+)', 1, 3), 1, 1) || '. ' as ФИО from teacher;
--3. Получите список преподавателей, родившихся в понедельник.
select * from teacher where to_char(birthday, 'd') = 2;
--4. Создайте представление, в котором поместите список преподавателей, которые родились в следующем месяце.
CREATE OR REPLACE VIEW next_month AS
SELECT *
FROM TEACHER
WHERE EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM ADD_MONTHS(SYSDATE, 1));

select * from next_month;
--5. Создайте представление, в котором поместите количество преподавателей, которые родились в каждом месяце.
create or replace view number_months as
select to_char(birthday, 'mm') месяц, count(*) количество from teacher group by to_char(birthday, 'mm') having count(*) >= 1
order by Количество desc;

select * from number_months;
--6. Создать курсор и вывести список преподавателей, у которых в следующем году юбилей.
declare
cursor teacher_birthday
return teacher%rowtype is
select * from teacher where MOD(extract(YEAR from sysdate) - extract(YEAR from birthday) + 1, 5) = 0;
v_teacher  TEACHER%rowtype;
begin
open teacher_birthday;
fetch teacher_birthday into v_teacher;
while (teacher_birthday%found)
loop
dbms_output.put_line(v_teacher.teacher || ' ' || v_teacher.teacher_name || ' ' || v_teacher.pulpit || ' ' || v_teacher.birthday || ' ' || v_teacher.salary);
fetch teacher_birthday into v_teacher;
end loop;
close teacher_birthday;
end;
--7. Создать курсор и вывести среднюю заработную плату по кафедрам с округлением вниз до целых, вывести средние итоговые значения для каждого факультета и для всех факультетов в целом.
declare
cursor teachers_avg_salary is
select pulpit, floor(avg(salary)) as AVG_SALARY from TEACHER group by pulpit;
cursor faculty_avg_salary is select FACULTY, AVG(SALARY) from TEACHER
join PULPIT P on TEACHER.PULPIT = P.PULPIT group by FACULTY;
cursor faculties_avg_salary is select AVG(SALARY) from TEACHER;
m_pulpit  TEACHER.PULPIT%type;
m_salary  TEACHER.SALARY%type;
m_faculty PULPIT.FACULTY%type;
begin
dbms_output.put_line('--------------- По кафедрам -----------------');
open teachers_avg_salary;
fetch teachers_avg_salary into m_pulpit, m_salary;
while (teachers_avg_salary%found)
loop
dbms_output.put_line(m_pulpit || ' ' || m_salary);
fetch teachers_avg_salary into m_pulpit, m_salary;
end loop;
close teachers_avg_salary;
dbms_output.put_line('--------------- По факультетам -----------------');
open faculty_avg_salary;
fetch faculty_avg_salary into m_faculty, m_salary;
while (faculty_avg_salary%found)
loop
dbms_output.put_line(m_faculty || ' ' || m_salary);
fetch faculty_avg_salary into m_faculty, m_salary;
end loop;
close faculty_avg_salary;
dbms_output.put_line('--------------- По всем факультетам -----------------');
open faculties_avg_salary;
fetch faculties_avg_salary into m_salary;
dbms_output.put_line(round(m_salary, 2));
close faculties_avg_salary;
end;
--8. Создайте собственный тип PL/SQL-записи (record) и продемонстрируйте работу с ним. Продемонстрируйте работу с вложенными записями. Продемонстрируйте и объясните операцию присвоения. 
declare
type person_record is record (
name varchar2(100),
age number);

type family_record is record (
father person_record,
mother person_record,
child person_record);

myfamily family_record;
begin
myfamily.father.name := 'papa';
myfamily.father.age := 40;
myfamily.mother.name := 'mama';
myfamily.mother.age := 38;
myfamily.child.name := 'child';
myfamily.child.age := 10;
dbms_output.put_line('отец: ' || myfamily.father.name || ', возраст: ' || myfamily.father.age);
dbms_output.put_line('мать: ' || myfamily.mother.name || ', возраст: ' || myfamily.mother.age);
dbms_output.put_line('ребенок: ' || myfamily.child.name || ', возраст: ' || myfamily.child.age);
end;