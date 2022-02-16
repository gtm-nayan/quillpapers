use std::{error::Error, fmt, str::FromStr};

use regex::Regex;

#[derive(Debug, PartialEq)]
enum ExamSeries {
	M,
	S,
	W,
}

#[derive(Debug)]
struct InvalidExamSeries;
impl Error for InvalidExamSeries {}
impl fmt::Display for InvalidExamSeries {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Invalid exam series")
	}
}

impl FromStr for ExamSeries {
	type Err = InvalidExamSeries;

	fn from_str(s: &str) -> Result<Self, Self::Err> {
		match s {
			"m" => Ok(ExamSeries::M),
			"s" => Ok(ExamSeries::S),
			"w" => Ok(ExamSeries::W),
			_ => Err(InvalidExamSeries),
		}
	}
}

#[derive(Debug)]
pub struct QuestionPaper {
	subject_code: u16,
	series: ExamSeries,
	year: u8,
	paper_variant_major: u8,
	paper_variant_minor: u8,
}

impl PartialEq for QuestionPaper {
	fn eq(&self, other: &Self) -> bool {
		self.subject_code == other.subject_code
			&& self.series == other.series
			&& self.year == other.year
			&& self.paper_variant_major == other.paper_variant_major
			&& self.paper_variant_minor == other.paper_variant_minor
	}
}

lazy_static::lazy_static!(
	static ref VALIDATOR_REGEX: Regex = Regex::new(r"\d{4}_[msw]\d{2}_qp_\d{1,2}.pdf").unwrap();
);

impl QuestionPaper {
	fn test_name(name: &str) -> bool {
		VALIDATOR_REGEX.is_match(name)
	}

	pub fn new(filename: &str) -> Result<Self, Box<dyn Error>> {
		if !Self::test_name(filename) {
			return Err("Invalid filename".into());
		}

		let mut parts = filename.split('_');

		let subject_code = parts.next().unwrap().parse()?;

		let series_and_year = parts.next().unwrap();

		let series = (&series_and_year[0..1]).parse()?;
		let year = (&series_and_year[1..=2]).parse()?;

		// Discard `qp`
		parts.next();

		let paper_variant = parts
			.next()
			.unwrap()
			.strip_suffix(".pdf")
			.unwrap()
			.parse()?;
		let temp = paper_variant / 10;

		let paper_variant_major = if temp == 0 { paper_variant } else { temp };

		let paper_variant_minor = if temp == 0 { 0 } else { paper_variant % 10 };

		Ok(Self {
			subject_code,
			series,
			year,
			paper_variant_major,
			paper_variant_minor,
		})
	}
}

#[cfg(test)]
mod tests {

	use super::*;

	#[test]
	fn test_test_name() {
		assert!(QuestionPaper::test_name("9701_m16_qp_12.pdf"));
		assert!(QuestionPaper::test_name("9701_s03_qp_1.pdf"));
		assert!(!(QuestionPaper::test_name("tnestn.pdf.pdf")));
	}

	#[test]
	fn test_new() {
		assert_eq!(
			QuestionPaper::new("9701_m16_qp_12.pdf").unwrap(),
			QuestionPaper {
				subject_code: 9701,
				series: ExamSeries::M,
				year: 16,
				paper_variant_major: 1,
				paper_variant_minor: 2,
			}
		);
		assert_eq!(
			QuestionPaper::new("9701_s03_qp_1.pdf").unwrap(),
			QuestionPaper {
				subject_code: 9701,
				series: ExamSeries::S,
				year: 3,
				paper_variant_major: 1,
				paper_variant_minor: 0,
			}
		);
	}
}
