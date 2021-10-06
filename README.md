## Quillpapers

A website to practise past papers for A Level Chemistry (9701), Physics (9702) and Biology (9700) with more subjects to come.

Built with SvelteKit, uses a PostgreSQL database to store and serve questions.

## Developing

Follow these steps in order to start a development server on your machine:

1. Clone the repository
2. Run `pnpm install` to install dependencies
3. Create a PostgreSQL database and inside it create the following two tables

```
                         Table "public.topics"
    Column    |          Type          | Collation | Nullable | Default
--------------+------------------------+-----------+----------+---------
 subject_code | character varying(6)   |           | not null |
 topic_number | smallint               |           | not null |
 topic_name   | character varying(255) |           |          |
Indexes:
    "topics_pkey" PRIMARY KEY, btree (subject_code, topic_number)
Referenced by:
    TABLE "questions" CONSTRAINT "questions_subject_code_topic_fkey" FOREIGN KEY (subject_code, topic) REFERENCES
 topics(subject_code, topic_number) ON DELETE SET DEFAULT
```

```
                                Table "public.questions"
       Column       |         Type         | Collation | Nullable |       Default
--------------------+----------------------+-----------+----------+---------------------
 subject_code       | character varying(6) |           | not null |
 series             | exam_series          |           | not null |
 exam_year          | smallint             |           | not null |
 paper_variant      | smallint             |           | not null |
 question_number    | smallint             |           | not null |
 question_text      | text                 |           |          |
 correct_answer     | answer_choices       |           |          |
 topic              | smallint             |           | not null | 0
 bad_cropping_flags | integer              |           |          | 0
 wrong_topic_flags  | smallint[]           |           |          | ARRAY[]::smallint[]
 wrong_answer_flags | smallint             |           |          | 0
Indexes:
    "questions_pkey" PRIMARY KEY, btree (subject_c
ode, series, exam_year, paper_variant, question_nu
mber)
    "questions_sub_n_topic_idx" btree (subject_cod
e, topic)
Foreign-key constraints:
    "questions_subject_code_topic_fkey" FOREIGN KE
Y (subject_code, topic) REFERENCES topics(subject_
code, topic_number) ON DELETE SET DEFAULT
```

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
pnpm run build
```

> You can preview the built app with `pnpm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
