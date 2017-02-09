custom rendering pipeline:
- Compute the cell widths.
- Pre-render:
	- Compute all cells including the table borders. Keep in 2d array
	to later do the actual cutting when rendering for real.
- Render: This applies the actual sectioning of the entire document.
