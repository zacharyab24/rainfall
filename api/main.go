package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"rainfall/api/db"
	"rainfall/api/routes"
)

func main() {
	database := db.InitDB()
	defer database.Close()

	r := gin.Default()
	routes.RegisterRoutes(r, database)
	r.Run(":8080")
}
