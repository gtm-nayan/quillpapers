import re
from pathlib import Path

from fitz import Document, Page, Rect

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
        self,
        filepath: str,
        start_page: int = 2,
        max_x: int = 65,
        max_y: int = 780,
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

        self.doc = Document(str(self.filepath))
        self.questions: list[Question] = []
        self.width = self.doc[0].mediabox_size[0]

    def _get_lowest_graphic_y2(self, page: Page):
        lowest_graphic_y2: float = 0
        max_y2: float = self.max_y

        for drawing in page.get_drawings():
            width: float = drawing["rect"][2] - drawing["rect"][0]
            y2 = drawing["rect"][3]

            if y2 < max_y2:
                if width <= 490:
                    lowest_graphic_y2 = max(lowest_graphic_y2, y2)
                else:
                    max_y2 = y2

        for image in page.get_image_info():
            lowest_graphic_y2 = max(lowest_graphic_y2, image["bbox"][3])

        return lowest_graphic_y2, max_y2

    def extract_questions(self):
        for page_num in range(self.start_page - 1, self.doc.page_count):
            yield from self.extract_questions_from_page(self.doc[page_num])

    def extract_questions_from_page(self, page: Page):
        (lowest_graphic_y2, max_y2) = self._get_lowest_graphic_y2(page)

        prev_question: Question | None = None

        question_number_clip = Rect(40, 55, self.max_x, max_y2)

        text_page_dict = page.get_textpage(question_number_clip).extractDICT()

        # region figure out where questions start and end
        for block in text_page_dict["blocks"]:
            for line in block["lines"]:
                for span in line["spans"]:

                    try:
                        question_number = int(span["text"])
                        start_of_this_question: float = span["bbox"][1]

                        if prev_question is not None:
                            prev_question.y2 = (
                                start_of_this_question
                                - 5  # 5 less than start of current question
                            )
                            yield prev_question

                        prev_question = Question(
                            question_number,
                            self.metadata,
                            page.number,
                            start_of_this_question,
                        )

                    except (ValueError):
                        # Means it's not a question number
                        continue

        # endregion

        all_text_clip = Rect(40, 55, page.mediabox_size.x, max_y2)
        text_page_dict = page.get_textpage(all_text_clip).extractDICT()

        # region figure out where the last question ends
        y2_of_lowest_text = 0
        for block in text_page_dict["blocks"]:
            for line in block["lines"]:
                for span in line["spans"]:
                    y2_of_lowest_text = span["bbox"][3]

        if prev_question is not None:
            prev_question.y2 = (
                max(y2_of_lowest_text, lowest_graphic_y2)
                + 5  # 5 more than end of last question
            )
            yield prev_question
        # endregion
