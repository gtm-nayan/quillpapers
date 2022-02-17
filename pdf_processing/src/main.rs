pub mod question_paper;

use std::path::Path;

use lopdf::Object;
#[allow(unused_imports)]
use lopdf::{dictionary, Dictionary, Document};

fn main() {
	let mut doc = Document::load(Path::new("9701_m16_qp_12.pdf")).unwrap();
	let pages = doc.get_pages();
	let page_2 = pages.get(&2).unwrap();

	for obj in doc.get_dictionary(*page_2).unwrap() {
		if let Ok(v) = obj.1.as_reference() {
            println!("{:?}", doc.get_object(v).unwrap().type_name());
        }
	}
}
