package routes

import (
	"database/sql"
	"rainfall/api/controllers"
	"rainfall/api/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, db *sql.DB) {
	// Public routes
	r.POST("/auth/register", controllers.Register(db))
	r.POST("/auth/login", controllers.Login(db))

	// Protected routes
	protected := r.Group("/api")
	protected.Use(middlewares.AuthMiddleware())
	protected.POST("/auth/logout", controllers.Logout())
}
