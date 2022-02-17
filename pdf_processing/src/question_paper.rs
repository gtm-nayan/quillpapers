use std::{error::Error, fmt, str::FromStr};

use regex::Regex;

#[derive(Debug)]
struct InvalidExamSeries;
impl Error for InvalidExamSeries {}
impl fmt::Display for InvalidExamSeries {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "Invalid exam series")
	}
}

#[derive(Debug, PartialEq)]
enum ExamSeries {
	M,
	S,
	W,
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
	static ref VALIDATOR_REGEX: Regex = Regex::new(r"^(\d{4})_([msw])(\d{2})_qp_(\d)(\d?)\.pdf$").unwrap();
);

impl QuestionPaper {
	pub fn new(filename: &str) -> Result<Self, Box<dyn Error>> {
		let caps = VALIDATOR_REGEX
			.captures(filename)
			.ok_or("Invalid filename")?;

		let subject_code = caps.get(1).unwrap().as_str().parse()?;
		let series = caps.get(2).unwrap().as_str().parse()?;
		let year = caps.get(3).unwrap().as_str().parse()?;

		let paper_variant_major = caps.get(4).unwrap().as_str().parse()?;

		let paper_variant_minor = match caps.get(5) {
			Some(m) => match m.as_str() {
				"" => 0,
				n => n.parse()?,
			},
			None => 0,
		};

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
