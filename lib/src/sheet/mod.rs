mod csv;
mod xlsx;

use std::path::Path;
use math::{Dimension, Position};

#[derive(Debug)]
pub enum CellKind {
    Empty,
    String,
    Date,
    Int,
    Float,
    Boolean
}

#[derive(Debug)]
pub struct Cell {
    pub kind: CellKind,
    pub content: String,
    // A cell in xlsx can be merged, making it span multiple cells. To make things
    // simple, I will handle this by allowing a single cell to be in multiple
    // locations in the matrix, along with its dimension information.
    pub dimension: Dimension,
    pub position: Position
}

#[derive(Debug)]
pub struct Sheet {
    pub name: String,
    pub rows: Vec<Vec<Cell>>,
    pub headers: Vec<Cell>
}

impl Sheet {
    pub fn open(path: &Path) -> Result<Vec<Sheet>, &'static str> {
        let extension = path
            .extension()
            .and_then(|ext| { ext.to_str() });
        match extension {
            Some(".xlsx") => xlsx::open(path),
            Some(".csv") => csv::open(path),
            _ => Err("Bad file extension")
        }
    }
}
