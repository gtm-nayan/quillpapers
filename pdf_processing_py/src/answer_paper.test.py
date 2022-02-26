import unittest
from answer_paper import AnswerPaper


class TestSuite(unittest.TestCase):
    def before_17(self):
        paper = AnswerPaper("9701_m16_ms_12.pdf")
        answers = paper.extract_answers()
        num = 0
        for q in answers:
            print(q)
            num += 1
        self.assertEqual(num, 40)

    def after_17(self):
        paper = AnswerPaper("9701_m17_ms_12.pdf")
        answers = paper.extract_answers()
        num = 0
        for q in answers:
            print(q)
            num += 1
        self.assertEqual(num, 40)


if __name__ == "__main__":
    unittest.main()
