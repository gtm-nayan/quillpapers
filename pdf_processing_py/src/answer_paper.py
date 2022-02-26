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

        self.doc = Document(str(self.filepath))

        self.filepath = fp
        self.filename = fp.name
        self.start_page = start_page
        self.metadata = PaperMetadata(self.filename, FILENAME_REGEX)

        self.width = self.doc[0].mediabox_size[0]
