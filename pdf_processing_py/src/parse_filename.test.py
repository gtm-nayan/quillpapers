import unittest

from parse_filename import PaperMetadata
from question_paper import (
    FILENAME_REGEX as QUESTION_PAPER_FILENAME_REGEX,
)
from answer_paper import (
    FILENAME_REGEX as ANSWER_PAPER_FILENAME_REGEX,
)


class TestSuite(unittest.TestCase):
    def question_paper(self):
        metadata = PaperMetadata("9701_m16_qp_12.pdf", QUESTION_PAPER_FILENAME_REGEX)

        self.assertEqual(metadata.subject_code, 9701)
        self.assertEqual(metadata.series, "m")
        self.assertEqual(metadata.exam_year, 16)
        self.assertEqual(metadata.paper_variant_major, 1)
        self.assertEqual(metadata.paper_variant_minor, 2)

        metadata = PaperMetadata("9701_s03_qp_1.pdf", QUESTION_PAPER_FILENAME_REGEX)
        self.assertEqual(metadata.subject_code, 9701)
        self.assertEqual(metadata.series, "s")
        self.assertEqual(metadata.exam_year, 3)
        self.assertEqual(metadata.paper_variant_major, 1)
        self.assertEqual(metadata.paper_variant_minor, 0)

    def answer_paper(self):
        metadata = PaperMetadata("9701_m16_ms_12.pdf", ANSWER_PAPER_FILENAME_REGEX)

        self.assertEqual(metadata.subject_code, 9701)
        self.assertEqual(metadata.series, "m")
        self.assertEqual(metadata.exam_year, 16)
        self.assertEqual(metadata.paper_variant_major, 1)
        self.assertEqual(metadata.paper_variant_minor, 2)

        metadata = PaperMetadata("9701_s03_ms_1.pdf", ANSWER_PAPER_FILENAME_REGEX)
        self.assertEqual(metadata.subject_code, 9701)
        self.assertEqual(metadata.series, "s")
        self.assertEqual(metadata.exam_year, 3)
        self.assertEqual(metadata.paper_variant_major, 1)
        self.assertEqual(metadata.paper_variant_minor, 0)


if __name__ == "__main__":
    unittest.main()
