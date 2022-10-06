-- stock definition

CREATE TABLE stock (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	product_id INTEGER NOT NULL,
	place_id INTEGER NOT NULL,
	cost TEXT NOT NULL,
	latestPrice TEXT,
	quantity TEXT NOT NULL,
	unit_id INTEGER NOT NULL,
	CONSTRAINT stock_FK FOREIGN KEY (product_id) REFERENCES product(id),
	CONSTRAINT stock_FK_1 FOREIGN KEY (place_id) REFERENCES place(id),
	CONSTRAINT stock_FK_2 FOREIGN KEY (unit_id) REFERENCES unit(id)
);

CREATE UNIQUE INDEX stock_product_id_IDX ON stock (product_id,place_id);