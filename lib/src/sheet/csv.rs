
extern crate csv;

use std::path::Path;

use sheet::{Cell, CellKind, Sheet};
use csv::Reader;
use std::fs::File;
use math::{Dimension, Position};

pub fn parse_cell(str_cell: String) -> Cell {
    let kind = if str_cell.len() == 0 {
        CellKind::Empty
    } else {
        CellKind::String
    };

    Cell {
        kind,
        content: str_cell,
        dimension: Dimension {
            width: 1,
            length: 1
        },


    if str_cell.len() == 0 {
        Cell::Empty
    } else {
        Cell::String(str_cell)
    }
}

pub fn parse_row(record: csv::Result<Vec<String>>) -> Result<Vec<Cell>, &'static str> {
    let mut row = Vec::new();
    for str_cell in record.map_err(|_| "Failed to parse csv file")? {
        row.push(parse_cell(str_cell))
    }
    Ok(row)
}

pub fn open(path: &Path) -> Result<Vec<Sheet>, &'static str> {
    let file = File::open(path).map_err(|_| "Failed to open file")?;
    let mut reader = Reader::from_reader(file);

    let headers: Vec<Cell> = parse_row(reader.headers())?;
    let mut rows:Vec<Vec<Cell>> = Vec::new();

    for record in reader.records() {
        rows.push(parse_row(record)?);
    }

    let sheet_name = match path.file_stem() {
        Some(os_str) => {
            match os_str.to_str() {
                Some(s) => Ok(s),
                _ => Err("Failed to extract csv sheet name")
            }
        },
        None => Err("Failed to extract csv sheet name")
    };

    sheet_name.map(|name| {
        let sheet = Sheet {
            name.to_owned(),
            rows,
            headers
        };
        vec![sheet]
    })
}

macro_rules! assert_member {
    ($val:expr, $enum:pat) => {
        match $val {
            $enum => (),
            _ => panic!("Incorrect enum member")
        }
    };
}

#[test]
fn cell_parsing() {
    assert_member!(parse_cell(String::from("")), Cell::Empty);
    assert_member!(parse_cell(String::from("foobar")), Cell::String(_));
}

#[test]
fn row_parsing() {
    let fake = csv::Result(vec!["a", ""]);
    let row = parse_row(fake).unwrap();

    assert_member(row.get(0).unwrap(), Cell::String(_));
}

