create table XXX_t(id number(3) primary key, name varchar2(50));

insert into XXX_t (id, name) values (1, 'Kate');
insert into XXX_t (id, name) values (2, 'Roma');
insert into XXX_t (id, name) values (3, 'Anna');
commit;

update XXX_t set name = 'Lena' where id = 2;
update XXX_t set name = 'Sonya' where id = 3;
commit;

select count(*) as TotalCount
    from XXX_t
        where id > 1;
        
delete from XXX_t where id = 3;

commit;

create table XXX_t1 ( id_child number(3) primary key,
                            id_parent number(3),
                            name varchar2(50),
    constraint fk_xxx_t foreign key (id_parent) references XXX_t(id))

insert into XXX_t1 (id_child, id_parent, name) values (1, 2, 'Stasy');
insert into XXX_t1 (id_child, id_parent, name) values (2, 1, 'Ken');

select XXX_t.id, XXX_t.name, XXX_t1.name 
from XXX_t left join XXX_t1 
on XXX_t.id = XXX_t1.id_parent;
        
select XXX_t.id, XXX_t.name, XXX_t1.name 
from XXX_t right join XXX_t1 
on XXX_t.id = XXX_t1.id_parent;

select XXX_t.id, XXX_t.name, XXX_t1.name 
from XXX_t inner join XXX_t1 
on XXX_t.id = XXX_t1.id_parent;

drop table XXX_t1;
drop table XXX_t;


