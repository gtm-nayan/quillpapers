import re
from pathlib import Path

from fitz import Document

from question import Question

FILENAME_REGEX = re.compile(r"^(\d{4})_([msw])(\d{2})_qp_(\d)(\d)?.pdf$")


def parse_filename(filename: str):
    groups = FILENAME_REGEX.match(filename)

    if groups is None:
        raise ValueError(f"Invalid filename: {filename}")

    subject_code = int(groups[1])
    series = groups[2]
    exam_year = int(groups[3])
    paper_variant_major = int(groups[4])
    paper_variant_minor = int(groups[5]) if groups[5] is not None else 0

    return (subject_code, series, exam_year, paper_variant_major, paper_variant_minor)


class QuestionPaper:
    def __init__(
        self, filepath: str, start_page: int = 1, max_x: int = 68, max_y: int = 780
    ):
        fp = Path(filepath)

        if not (fp.is_file() and fp.exists()):
            raise ValueError(f"Invalid filepath: {filepath}")

        self.filepath = fp
        self.filename = fp.name
        self.start_page = start_page
        self.metadata = parse_filename(self.filename)
        self.max_x = max_x
        self.max_y = max_y

        self.initialize_doc()
        self.questions: list[Question] = []

    def initialize_doc(self):
        self.doc = Document(str(self.filepath))
