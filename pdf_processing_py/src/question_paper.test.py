import unittest
from question_paper import QuestionPaper


class TestSuite(unittest.TestCase):
    def test_extraction(self):
        qp = QuestionPaper("9701_m16_qp_12.pdf")
        questions = qp.extract_questions()
        num = 0
        print(qp.metadata)
        for q in questions:
            print(q)
            num += 1
        self.assertEqual(num, 40)


if __name__ == "__main__":
    unittest.main()
