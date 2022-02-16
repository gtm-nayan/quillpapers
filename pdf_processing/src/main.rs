pub mod question_paper;

#[allow(unused_imports)]
use lopdf::{dictionary, Dictionary, Document};

fn main() {
	let mut doc = Document::load(std::path::Path::new("9701_m16_qp_12.pdf")).unwrap();

    println!("{:?}", doc);
}
