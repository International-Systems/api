
INSERT INTO public.employee_config_timetable(
	empnum, weekday, start_time, end_time, break_time)
	(
	SELECT empnum, 1, '07:00:00'::interval,'16:00:00'::interval,'01:00:00'::interval FROM employee
	UNION 
	SELECT empnum, 2, '07:00:00'::interval,'16:00:00'::interval,'01:00:00'::interval FROM employee
	UNION
	SELECT empnum, 3, '07:00:00'::interval,'16:00:00'::interval,'01:00:00'::interval FROM employee
	UNION
	SELECT empnum, 4, '07:00:00'::interval,'16:00:00'::interval,'01:00:00'::interval FROM employee
	UNION
	SELECT empnum, 5, '07:00:00'::interval,'16:00:00'::interval,'01:00:00'::interval FROM employee
	 )
	;
	