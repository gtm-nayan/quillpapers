CREATE OR REPLACE FUNCTION increment_bad_cropping_flags(
	sub_code SMALLINT,
	i_series ExamSeries,
	i_year SMALLINT,
	pv_major SMALLINT,
	pv_minor SMALLINT,
	qn SMALLINT
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
	UPDATE questions
	SET
		bad_cropping_flags = bad_cropping_flags + 1
	WHERE
		subject_code = sub_code
		AND series = i_series
		AND exam_year = i_year
		AND paper_variant_major = pv_major
		AND paper_variant_minor = pv_minor
		AND question_number = qn;
END; $$;


CREATE OR REPLACE FUNCTION increment_wrong_answer_flags(
	sub_code SMALLINT,
	i_series ExamSeries,
	i_year SMALLINT,
	pv_major SMALLINT,
	pv_minor SMALLINT,
	qn SMALLINT
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
	UPDATE questions
	SET
		wrong_answer_flags = wrong_answer_flags + 1
	WHERE
		subject_code = sub_code
		AND series = i_series
		AND exam_year = i_year
		AND paper_variant_major = pv_major
		AND paper_variant_minor = pv_minor
		AND question_number = qn;
END; $$;


CREATE OR REPLACE FUNCTION push_wrong_topic_flags(
	sub_code SMALLINT,
	i_series ExamSeries,
	i_year SMALLINT,
	pv_major SMALLINT,
	pv_minor SMALLINT,
	qn SMALLINT,
	topic_num SMALLINT
) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE matching_topic_num SMALLINT;
BEGIN
	SELECT topic_number
	INTO matching_topic_num
	FROM topics
	WHERE
		subject_code = sub_code
		AND paper_variant_major = pv_major
		AND topic_number = topic_num;
	
	IF found THEN
		UPDATE questions
		SET
			wrong_topic_flags = wrong_topic_flags || topic_num
		WHERE
			subject_code = sub_code
			AND series = i_series
			AND exam_year = i_year
			AND paper_variant_major = pv_major
			AND paper_variant_minor = pv_minor
			AND question_number = qn;
	END IF;
END; $$;
