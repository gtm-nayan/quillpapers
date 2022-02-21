import unittest
from question_paper import parse_filename, QuestionPaper


class TestSuite(unittest.TestCase):
    def test_parse_filename(self):
        self.assertEqual(parse_filename("9701_m16_qp_12.pdf"), (9701, "m", 16, 1, 2))
        self.assertEqual(parse_filename("9701_s03_qp_1.pdf"), (9701, "s", 3, 1, 0))

        with self.assertRaises(ValueError):
            parse_filename("970qp_12.pdf.pdf")

        with self.assertRaises(ValueError):
            parse_filename("_9701_m16_qp_12.pdf")

    def test_extraction(self):
        qp = QuestionPaper("9701_m16_qp_12.pdf")
        questions = qp.extract_questions()
        # self.assertEqual(len(questions), 40)

        for q in questions:
            print(q)


if __name__ == "__main__":
    unittest.main()
