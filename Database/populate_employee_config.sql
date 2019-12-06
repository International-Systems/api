INSERT INTO public.employee_config(
	empnum, start_time, finish_time, wk_goal, timezone, token
) 
	(
		SELECT empnum, '07:00:00'::interval,'17:00:00'::interval,600, 'PST', uuid_generate_v4() FROM employee
	)