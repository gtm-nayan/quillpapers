from re import Pattern


class Metadata:
    def __init__(self, filename: str, FILENAME_REGEX: Pattern):
        self.filename = filename

        groups = FILENAME_REGEX.match(self.filename)

        if groups is None:
            raise ValueError(f"Invalid filename: {self.filename}")

        self.subject_code = int(groups[1])
        self.series = groups[2]
        self.exam_year = int(groups[3])
        self.paper_variant_major = int(groups[4])
        self.paper_variant_minor = int(groups[5]) if groups[5] is not None else 0
