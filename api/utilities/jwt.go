package utilities

import (
	"github.com/golang-jwt/jwt/v5"
	"os"
	"time"
)

var jwtSecret = []byte(os.Getenv("JWT_AUTH_SECRET"))

// GenerateAuthJWT Generates a JSON Web Token with a TTL of 1 hour. Used for auth within the application
// Preconditions: Receives int containing user id
// Postconditons: Return string containing generated JWT
func GenerateAuthJWT(userId int) (string, error) {
	claims := jwt.MapClaims{
		"userId": userId,
		"exp":    time.Now().Add(time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
