class Question:
    def __init__(self, question_number: int, page_number: int, y1: float):
        self.y1 = int(y1)
        self._y2 = 0
        self.page_number = page_number
        self.question_number = question_number

    def __str__(self) -> str:
        return f"Question #{self.question_number} on page {self.page_number} Starts at: {self.y1} Ends at: {self.y2}"

    @property
    def y2(self):
        return self._y2

    @y2.setter
    def y2(self, val):
        self._y2 = int(val)
