set serveroutput on;
alter database open;
SELECT * FROM SYS.TEACHER
SELECT * FROM SYS.FACULTY
SELECT * FROM SYS.SUBJECT

--1
declare
  procedure get_teachers(pcode SYS.TEACHER.pulpit%type) is
  begin
    for i in (select * from SYS.TEACHER where pulpit = pcode) loop
      dbms_output.put_line(i.teacher_name);
    end loop;
  end get_teachers;
begin
  get_teachers('ИСиТ');
end;
/

--2-3
declare
function get_num_teachers(pcode teacher.pulpit%type) return number
is num number := 0;
begin
select count(*) into num from teacher where pulpit = pcode;
return num;
end get_num_teachers;
begin
dbms_output.put_line(get_num_teachers('ИСиТ'));
end;
--4.1
declare procedure get_teachers (fcode faculty.faculty%type)
is begin
for i in (select * from teacher join pulpit ON teacher.pulpit = pulpit.pulpit where faculty = fcode)
loop
dbms_output.put_line(i.teacher ||  i.teacher_name || i.faculty);
end loop;
end;
begin
get_teachers('ИЭФ');
end;

--4.2
declare procedure get_subjects(pcode subject.pulpit%type) is
begin 
for i in (select * from subject where pulpit= pcode)
loop
dbms_output.put_line(i.subject_name || ' ' || i.pulpit);
end loop;
end;
begin
get_subjects('ИСиТ');
end;
--5.1
declare
function get_num_teachers(fcode faculty.faculty%type) return number
is
num number := 0;
begin
select count(*) into num from teacher
inner join PULPIT P on P.PULPIT = TEACHER.PULPIT
inner join FACULTY F on F.FACULTY = P.FACULTY
where F.FACULTY = fcode;
return num;
end get_num_teachers;
begin
dbms_output.put_line(get_num_teachers('ХТиТ'));
end;
--5.2
declare function get_num_subjects(pcode subject.pulpit%type) return number
is
num number := 0;
begin
select count(*) into num from subject
inner join PULPIT P on P.PULPIT = SUBJECT.PULPIT where P.PULPIT = pcode;
return num;
end;
begin
dbms_output.put_line(get_num_subjects('ИСиТ'));
end;
--6
create or replace package teachers is
procedure get_teachers (fcode faculty.faculty%type);
procedure get_subjects(pcode subject.pulpit%type);
function get_num_teachers (fcode faculty.faculty%type)return number;
function get_num_subjects(pcode subject.pulpit%type)return number;
end;
/
create or replace package body teachers is
procedure get_teachers(fcode faculty.faculty%type) is
begin
for i in (select * from teacher join pulpit on teacher.pulpit = pulpit.pulpit where faculty = fcode)
loop
dbms_output.put_line(i.teacher || ' ' || i.teacher_name || ' ' || i.faculty);
end loop;
end get_teachers;

procedure get_subjects(pcode subject.pulpit%type) is
begin
for i in (select * from subject where pulpit = pcode)
loop
dbms_output.put_line(i.subject_name || ' ' || i.pulpit);
end loop;
end get_subjects;

function get_num_teachers(fcode faculty.faculty%type) return number is
num number := 0;
begin
select count(*) into num from teacher inner join pulpit p on p.pulpit = teacher.pulpit inner join faculty f on f.faculty = p.faculty where f.faculty = fcode;
return num;
end get_num_teachers;

function get_num_subjects(pcode subject.pulpit%type) return number is
num number := 0;
begin
select count(*) into num from subject inner join pulpit p on p.pulpit = subject.pulpit where p.pulpit = pcode;
return num;
end get_num_subjects;
end teachers;
/
--7
begin
teachers.get_subjects('ИСиТ');
teachers.get_teachers('ИЭФ');
dbms_output.put_line(teachers.get_num_teachers('ХТиТ'));
dbms_output.put_line(teachers.get_num_subjects('ИСиТ'));
end;
