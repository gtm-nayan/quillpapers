CREATE TABLE topics (
	subject_code SMALLINT NOT NULL,
	paper_variant_major SMALLINT NOT NULL,
	topic_number SMALLINT NOT NULL,
	topic_name VARCHAR(255) NOT NULL,
	PRIMARY KEY (subject_code, paper_variant_major, topic_number)
);

CREATE TYPE PossibleAnswers AS ENUM ('A', 'B', 'C', 'D');

CREATE TYPE ExamSeries AS ENUM ('m', 's', 'w');

CREATE TABLE questions (
	subject_code SMALLINT NOT NULL,
	series ExamSeries NOT NULL,
	exam_year SMALLINT NOT NULL,
	paper_variant_major SMALLINT NOT NULL,
	paper_variant_minor SMALLINT NOT NULL,
	question_number SMALLINT NOT NULL,
	question_text TEXT,
	correct_answer PossibleAnswers NOT NULL,
	topic_number SMALLINT DEFAULT 0 NOT NULL,
	bad_cropping_flags SMALLINT DEFAULT 0,
	wrong_topic_flags SMALLINT [] DEFAULT ARRAY [] :: SMALLINT [],
	wrong_answer_flags SMALLINT DEFAULT 0,
	CONSTRAINT question_id
		PRIMARY KEY (
			subject_code,
			series,
			exam_year,
			paper_variant_major,
			paper_variant_minor,
			question_number
		),
	CONSTRAINT question_topic_id
		FOREIGN KEY (subject_code, paper_variant_major, topic_number)
		REFERENCES topics (subject_code, paper_variant_major, topic_number)
		ON DELETE SET DEFAULT
);

CREATE INDEX questions_sub_pvmajor_topic_num ON questions USING btree (subject_code, paper_variant_major, topic_number);

-- Only run this after seeding the database 
-- ALTER TABLE questions CLUSTER ON questions_sub_pvmajor_topic_num;
