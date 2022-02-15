CREATE OR REPLACE FUNCTION random_casual_question(
	sub_code SMALLINT,
	pv_major SMALLINT,
	topic_num SMALLINT
) RETURNS TABLE (
	subject_code SMALLINT,
	series ExamSeries,
	exam_year SMALLINT,
	paper_variant SMALLINT,
	question_number SMALLINT,
	correct_answer PossibleAnswers
) LANGUAGE plpgsql AS $$ 
BEGIN 
	RETURN QUERY
	WITH matching_questions AS (
		SELECT * FROM questions
		WHERE
		questions.subject_code = sub_code
		AND questions.paper_variant_major = pv_major
		AND questions.topic_number = topic_num
	)
	SELECT
		m.subject_code,
		m.series,
		m.exam_year,
		(m.paper_variant_major * 10::SMALLINT + m.paper_variant_minor) as paper_variant,
		m.question_number,
		m.correct_answer
	FROM
		matching_questions m
	OFFSET FLOOR (
		random() * (
			SELECT COUNT(*) FROM matching_questions
		)
	) 
	LIMIT 1;
END; $$;

CREATE OR REPLACE FUNCTION random_speedrun_questions(
	sub_code SMALLINT,
	pv_major SMALLINT
) RETURNS TABLE (
	subject_code SMALLINT,
	series ExamSeries,
	exam_year SMALLINT,
	paper_variant SMALLINT,
	question_number SMALLINT,
	correct_answer PossibleAnswers,
	topic_number SMALLINT
) LANGUAGE plpgsql AS $$ 
BEGIN 
	RETURN QUERY
		SELECT
			m.subject_code,
			m.series,
			m.exam_year,
			(m.paper_variant_major * 10::SMALLINT + m.paper_variant_minor) as paper_variant,
			m.question_number,
			m.correct_answer,
			m.topic_number
		FROM
			questions m
		WHERE
			m.subject_code = sub_code
			AND m.paper_variant_major = pv_major
		ORDER BY RANDOM()
		LIMIT 40;
END; $$;
