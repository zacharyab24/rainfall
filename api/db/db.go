package db

import "database/sql"

func InitDB() *sql.DB {
	datebase, err := sql.Open("sqlite3", "./rainfall.db")
	if err != nil {
		panic(err)
	}
	return datebase
}
