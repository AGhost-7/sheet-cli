
extern crate csv;

mod sheet;
mod params;

use sheet::Sheet;
use std::path::Path;

use params::Params;

fn main() {
    let path = Path::new("test/fixtures/simple.csv");
    let params = Params { sheet_name: None };
    let sheet = Sheet::open(path, &params);
}
