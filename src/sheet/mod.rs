mod csv;
mod xlsx;

use params::Params;
use std::path::Path;

#[derive(Debug)]
pub enum Cell {
    Empty,
    String(String),
    Date,
    Int(i64),
    Float(f64),
    Boolean
}

#[derive(Debug)]
pub struct Sheet {
    pub rows: Vec<Vec<Cell>>,
    pub headers: Vec<Cell>
}


impl Sheet {
    pub fn open(path: &Path, params: &Params) -> Result<Sheet, &'static str> {
        let extension = path
            .extension()
            .and_then(|ext| { ext.to_str() });
        match extension {
            Some(".xlsx") => xlsx::open(path, params),
            Some("csv") => csv::open(path),
            _ => Err("Bad file extension")
        }
    }
}
