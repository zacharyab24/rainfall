package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"rainfall/api/db"
	"rainfall/api/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database := db.InitDB()
	defer database.Close()

	router := gin.Default()
	routes.RegisterRoutes(router, database)
	router.Run(":8080")
}
