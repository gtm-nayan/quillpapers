CREATE OR REPLACE FUNCTION increment_bad_cropping_flags(
	sub_code INTEGER,
	i_series ExamSeries,
	i_year INTEGER,
	pv_major INTEGER,
	pv_minor INTEGER,
	qn INTEGER
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
	UPDATE questions
	SET
		bad_cropping_flags = bad_cropping_flags + 1
	WHERE
		subject_code = sub_code::SMALLINT
		AND series = i_series
		AND exam_year = i_year::SMALLINT
		AND paper_variant_major = pv_major::SMALLINT
		AND paper_variant_minor = pv_minor::SMALLINT
		AND question_number = qn::SMALLINT;
END; $$;


CREATE OR REPLACE FUNCTION increment_wrong_answer_flags(
	sub_code INTEGER,
	i_series ExamSeries,
	i_year INTEGER,
	pv_major INTEGER,
	pv_minor INTEGER,
	qn INTEGER
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
	UPDATE questions
	SET
		wrong_answer_flags = wrong_answer_flags + 1
	WHERE
		subject_code = sub_code::SMALLINT
		AND series = i_series
		AND exam_year = i_year::SMALLINT
		AND paper_variant_major = pv_major::SMALLINT
		AND paper_variant_minor = pv_minor::SMALLINT
		AND question_number = qn::SMALLINT;
END; $$;


CREATE OR REPLACE FUNCTION push_wrong_topic_flags(
	sub_code INTEGER,
	i_series ExamSeries,
	i_year INTEGER,
	pv_major INTEGER,
	pv_minor INTEGER,
	qn INTEGER,
	topic_num INTEGER
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
	UPDATE questions
	SET
		wrong_topic_flags = wrong_topic_flags || topic_num::SMALLINT
	WHERE
		subject_code = sub_code::SMALLINT
		AND series = i_series
		AND exam_year = i_year::SMALLINT
		AND paper_variant_major = pv_major::SMALLINT
		AND paper_variant_minor = pv_minor::SMALLINT
		AND question_number = qn::SMALLINT;
END; $$;
