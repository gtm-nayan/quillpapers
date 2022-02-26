import re
from pathlib import Path

from fitz import Document, Page, Rect

FILENAME_REGEX = re.compile(r"^(\d{4})_([msw])(\d{2})_ms_(\d)(\d)?.pdf$")

from parse_filename import PaperMetadata

bounds = Rect(50, 72, 490, 780)


class AnswerPaper:
    def __init__(
        self,
        filepath: str,
        start_page: int = 2,
    ):
        fp = Path(filepath)

        self.doc = Document(fp)

        self.filepath = fp
        self.filename = fp.name
        self.start_page = start_page - 1
        self.metadata = PaperMetadata(self.filename, FILENAME_REGEX)

        self.width = self.doc[0].mediabox_size[0]

    def extract_answers(self):
        for i in range(self.start_page, self.doc.page_count):
            yield from self.extract_answers_from_page(self.doc[i])

    def extract_answers_from_page(self, page: Page):
        text_page_dict = page.get_textpage(bounds).extractDICT()

        prev_question_number = None

        for block in text_page_dict["blocks"]:
            for line in block["lines"]:
                for span in line["spans"]:
                    span_text: str = span["text"]

                    try:
                        prev_question_number = int(span_text)
                    except ValueError:
                        if prev_question_number is not None and span_text.startswith(
                            ("A", "B", "C", "D")
                        ):
                            yield (prev_question_number, span_text.strip())
                            prev_question_number = None
