package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"rainfall/api/controllers"
)

func RegisterRoutes(r *gin.Engine, db *sql.DB) {
	r.GET("/users", controllers.GetUsers(db))
}
