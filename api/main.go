package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

// albums slice to seed record album data.
var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

// Func to create a table and insert data for testing
func dbstuff(db *sql.DB) {
	_, err := db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT
        );
    `)
	if err != nil {
		fmt.Println("Error creating table")
	}

	_, err = db.Exec(`INSERT INTO users (name, email) VALUES (?, ?)`, "JOHN", "john@example.com")
	if err != nil {
		fmt.Println("Error inserting to table")
	}

	rows, err := db.Query(`SELECT id, name, email FROM users`)
	if err != nil {
		fmt.Println("Error retrieving table")
	}

	defer rows.Close()

	for rows.Next() {
		var id int
		var name, email string
		rows.Scan(&id, &name, &email)
		log.Println(id, name, email)
	}
}

func main() {
	// db stuff
	db, err := sql.Open("sqlite3", "./mydatabase.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	dbstuff(db)

	// REST stuff
	router := gin.Default()
	router.GET("/albums", getAlbums)
	router.Run("localhost:8080")
}
