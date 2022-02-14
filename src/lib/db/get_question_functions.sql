CREATE OR REPLACE FUNCTION random_casual_question(
	sub_code INTEGER,
	pv_major INTEGER,
	topic_num INTEGER
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
	SELECT
		questions.subject_code,
		questions.series,
		questions.exam_year,
		(questions.paper_variant_major * 10::SMALLINT + questions.paper_variant_minor) as paper_variant,
		questions.question_number,
		questions.correct_answer
	FROM
		questions
	WHERE
		questions.subject_code = sub_code::SMALLINT
		AND questions.paper_variant_major = pv_major::SMALLINT
		AND questions.topic_number = topic_num::SMALLINT
	OFFSET FLOOR(
		RANDOM() * (
			SELECT
				COUNT(*)
			FROM
				questions
		)
	)
	LIMIT 1;
END; $$;

CREATE OR REPLACE FUNCTION random_speedrun_questions(
	sub_code INTEGER
	pv_major INTEGER
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
	SELECT * FROM 
	(
		SELECT
			questions.subject_code,
			questions.series,
			questions.exam_year,
			(questions.paper_variant_major * 10::SMALLINT + questions.paper_variant_minor) as paper_variant,
			questions.question_number,
			questions.correct_answer,
			questions.topic_number
		FROM
			questions
		WHERE
			questions.subject_code = sub_code::SMALLINT
			AND questions.paper_variant_major = pv_major::SMALLINT
		OFFSET FLOOR(
			RANDOM() * (
				SELECT
					COUNT(*)
				FROM
					questions
			)
		)
		LIMIT 120
	) AS t
	ORDER BY
		RANDOM()
	LIMIT 40;
END; $$;
