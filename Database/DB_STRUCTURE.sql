-- Database: DB_SIS


CREATE TABLE public.bundle
(
    cut character varying(10) COLLATE pg_catalog."default",
    seq character varying(10) COLLATE pg_catalog."default",
    bundle integer,
	bundlex integer,
    buncut integer,
    style character varying(100) COLLATE pg_catalog."default",
    color character varying(100) COLLATE pg_catalog."default",
    room_number character varying(100) COLLATE pg_catalog."default",
    weight character varying(100) COLLATE pg_catalog."default",
    width character varying(100) COLLATE pg_catalog."default",
    size character varying(100) COLLATE pg_catalog."default",
    quantity character varying(100) COLLATE pg_catalog."default",
    firsttk character varying(100) COLLATE pg_catalog."default",
    lasttk character varying(100) COLLATE pg_catalog."default",
    shade character varying(100) COLLATE pg_catalog."default",
    status character varying(100) COLLATE pg_catalog."default",
    bundprinte character varying(100) COLLATE pg_catalog."default",
    boxdate character varying(100) COLLATE pg_catalog."default",
    box character varying(100) COLLATE pg_catalog."default",
    fwidth character varying(100) COLLATE pg_catalog."default",
    flength character varying(100) COLLATE pg_catalog."default",
    adfabric character varying(100) COLLATE pg_catalog."default",
    formula1 character varying(100) COLLATE pg_catalog."default",
    xtra1 character varying(100) COLLATE pg_catalog."default",
    xtra2 character varying(100) COLLATE pg_catalog."default",
    rs character varying(100) COLLATE pg_catalog."default",
    fulln character varying(100) COLLATE pg_catalog."default",
    pnl character varying(100) COLLATE pg_catalog."default",
    rtn character varying(100) COLLATE pg_catalog."default",
    rpt character varying(100) COLLATE pg_catalog."default",
    oc character varying(100) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.bundle
     OWNER to doadmin;
	
	



CREATE TABLE public.employee
(
  	empnum integer,
    clocknum integer,
    empdept character varying(100) COLLATE pg_catalog."default",
    firstname character varying(100) COLLATE pg_catalog."default",
    lastname character varying(100) COLLATE pg_catalog."default",
    address1 character varying(100) COLLATE pg_catalog."default",
    address2 character varying(100) COLLATE pg_catalog."default",
    city character varying(100) COLLATE pg_catalog."default",
    state character varying(100) COLLATE pg_catalog."default",
    zip character varying(100) COLLATE pg_catalog."default",
    phone character varying(100) COLLATE pg_catalog."default",
    social character varying(100) COLLATE pg_catalog."default",
    worknum character varying(100) COLLATE pg_catalog."default",
    workdate character varying(100) COLLATE pg_catalog."default",
    doctype character varying(100) COLLATE pg_catalog."default",
    paytype character varying(100) COLLATE pg_catalog."default",
    sex character varying(100) COLLATE pg_catalog."default",
    marital character varying(100) COLLATE pg_catalog."default",
    exemptions character varying(100) COLLATE pg_catalog."default",
    rate real,
    specrate integer,
    hiredate character varying(100) COLLATE pg_catalog."default",
    termdate character varying(100) COLLATE pg_catalog."default",
    salary character varying(100) COLLATE pg_catalog."default",
    birthday character varying(100) COLLATE pg_catalog."default",
    workmancom character varying(100) COLLATE pg_catalog."default",
    line character varying(100) COLLATE pg_catalog."default",
    xrate real,
    modular character varying(100) COLLATE pg_catalog."default",
    lasttop character varying(100) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.employee
     OWNER to doadmin;
	
	
	
	

CREATE TABLE public.operation
(
  	operation character varying(100) COLLATE pg_catalog."default",
    description character varying(100) COLLATE pg_catalog."default",
    standard character varying(100) COLLATE pg_catalog."default",
    category character varying(100) COLLATE pg_catalog."default",
    time character varying(100) COLLATE pg_catalog."default",
    issect character varying(100) COLLATE pg_catalog."default",
    skill character varying(100) COLLATE pg_catalog."default",
    descripti2 character varying(100) COLLATE pg_catalog."default",
    numcode character varying(100) COLLATE pg_catalog."default",
    maquina character varying(100) COLLATE pg_catalog."default",
    ph character varying(100) COLLATE pg_catalog."default",
    seq character varying(100) COLLATE pg_catalog."default",
    observns character varying(100) COLLATE pg_catalog."default",
    descripti3 character varying(100) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.operation
     OWNER to doadmin;
	
	
	
	


CREATE TABLE public.ticket
(
  	ticket integer,
    cut character varying(100) COLLATE pg_catalog."default",
	seq character varying(100) COLLATE pg_catalog."default",
	bundle integer,
	buncut integer,
	style character varying(100) COLLATE pg_catalog."default",
	opstyseq integer,
	operation character varying(100) COLLATE pg_catalog."default",
	section character varying(100) COLLATE pg_catalog."default",
	quantity integer ,
	standard real ,
	color character varying(100) COLLATE pg_catalog."default",
	width character varying(100) COLLATE pg_catalog."default",
	size character varying(100) COLLATE pg_catalog."default",
	date character varying(100) COLLATE pg_catalog."default",
	empnum integer,
	category character varying(100) COLLATE pg_catalog."default",
	stdtime real,
	time real ,
	shade integer,
	numempl character varying(100) COLLATE pg_catalog."default",
	tkttime character varying(100) COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.ticket
     OWNER to doadmin;



CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public."user"
(
    userid uuid NOT NULL DEFAULT uuid_generate_v4(),
    username integer NOT NULL,
    password integer NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (userid)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."user"
     OWNER to doadmin;



CREATE TABLE public.scans (
    empnum integer NOT NULL,
    ticket integer NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    duration interval
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."scans"
     OWNER to doadmin;






CREATE OR REPLACE FUNCTION scans_duration() RETURNS trigger AS $scans_duration$
    BEGIN
		-- Set the empnum for the ticket
		UPDATE public.ticket SET empnum=NEW.empnum
		WHERE ticket=NEW.ticket;
	
        -- Check that empname and salary are given
        IF NEW.end_time IS NULL THEN
            RETURN NEW;
        END IF;

        -- CALCULATE THE DURATION
        NEW.duration := NEW.end_time - NEW.start_time;
	
        RETURN NEW;
    END;
$scans_duration$ LANGUAGE plpgsql;

CREATE TRIGGER scans_duration BEFORE INSERT OR UPDATE ON scans
    FOR EACH ROW EXECUTE PROCEDURE scans_duration();
	
	





CREATE OR REPLACE VIEW public.scans_efficiency
 AS
 SELECT s.empnum,
    s.ticket,
    date_trunc('day'::text, s.start_time)::date AS date,
    s.start_time,
    s.end_time,
    date_part('epoch'::text, s.duration) AS duration,
    s.end_time IS NOT NULL AS is_finished,
    t."time" * 60::double precision AS expected_time,
    t."time" * 60::double precision / date_part('epoch'::text, s.duration) AS efficiency,
    t.quantity,
    t.standard,
    t.standard * t.quantity::double precision AS earning
   FROM scans s
     JOIN ticket t ON t.ticket = s.ticket;

ALTER TABLE public.scans_efficiency
     OWNER to doadmin;


CREATE OR REPLACE VIEW public.employee_date_earn
 AS
 SELECT scans_efficiency.empnum,
    scans_efficiency.date,
    sum(scans_efficiency.earning) AS earn
   FROM scans_efficiency
  WHERE scans_efficiency.is_finished
  GROUP BY scans_efficiency.empnum, scans_efficiency.date;

ALTER TABLE public.employee_date_earn
     OWNER to doadmin;
	
	
	



DELETE from public.user; 
INSERT INTO public.user (username, password)
	SELECT empnum as username, '1234' as password  FROM public.employee;

CREATE TABLE public.employee_config
(
    empnum integer NOT NULL,
    start_time time NOT NULL,
    finish_time time NOT NULL,
    wk_goal real NOT NULL
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.employee_config
     OWNER to doadmin;
	
DELETE from public.employee_config; 
INSERT INTO public.employee_config (empnum, start_time, finish_time, wk_goal)
	SELECT 
	empnum, 
	'07:00:00' as start_time, 
	'17:00:00' as end_time,  
	600.00 as wk_goal
	FROM public.employee;
	


CREATE OR REPLACE VIEW public.employee_week_earn
 AS
 SELECT employee_date_earn.empnum,
    to_char(employee_date_earn.date::timestamp with time zone, 'IYYY-IW'::text) AS week,
    sum(employee_date_earn.earn) AS earn
   FROM employee_date_earn
  WHERE to_char(employee_date_earn.date::timestamp with time zone, 'IYYY-IW'::text) = to_char(CURRENT_DATE::timestamp with time zone, 'IYYY-IW'::text)
  GROUP BY employee_date_earn.empnum, (to_char(employee_date_earn.date::timestamp with time zone, 'IYYY-IW'::text));

ALTER TABLE public.employee_week_earn
     OWNER to doadmin;
	


CREATE OR REPLACE VIEW public.get_employee
 AS
 SELECT 
e.empnum as empnum, 
clocknum, 
empdept, 
firstname, 
lastname,  
paytype, 
sex, 
marital,  
rate,
start_time, 
finish_time, 
wk_goal, 
e_date_earn.earn as earn_today,
e_week_earn.earn as earn_week
FROM public.employee as e
JOIN public.employee_config as conf on conf.empnum = e.empnum
JOIN public.employee_date_earn  as e_date_earn on e_date_earn.empnum = e.empnum
JOIN public.employee_week_earn  as e_week_earn on e_week_earn.empnum = e.empnum
WHERE date = current_date;

ALTER TABLE public.get_employee
     OWNER to doadmin;




	
CREATE OR REPLACE VIEW public.get_employee
 AS
 SELECT 
e.empnum as empnum, 
clocknum, 
empdept, 
firstname, 
lastname,  
paytype, 
sex, 
marital,  
rate,
start_time, 
finish_time, 
wk_goal, 
e_date_earn.earn as earn_today,
e_week_earn.earn as earn_week,
current_date +  start_time as  start_timestamp,
current_date +  finish_time as  finish_timestamp,
8 * (extract(dow from  current_date)-1) * rate as salary_week,
8 * (extract(dow from  current_date)-1) as worked_hours_week
FROM public.employee as e
LEFT JOIN public.employee_config as conf on conf.empnum = e.empnum
LEFT JOIN (SELECT * FROM public.employee_date_earn WHERE date = current_date)  as e_date_earn on e_date_earn.empnum = e.empnum
LEFT JOIN (SELECT * FROM public.employee_week_earn WHERE week = to_char(CURRENT_DATE, 'IYYY-IW')) as e_week_earn on e_week_earn.empnum = e.empnum
;

ALTER TABLE public.get_employee
     OWNER to doadmin;

