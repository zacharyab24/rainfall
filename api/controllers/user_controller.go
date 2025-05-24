package controllers

import (
	"database/sql"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"net/mail"
	"rainfall/api/dtos"
	"rainfall/api/models"
	"regexp"

	"github.com/gin-gonic/gin"
	"rainfall/api/utilities"
)

// Register function for handling login, called by router
// Preconditions: receives a pointer to db
// Postconditions: If register is successful, returns HTTP 200 and sets JWT cookie, else returns an error response
func Register(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		var dto dtos.CreateUserDto

		// Bind and validate JSON
		if err := c.ShouldBindJSON(&dto); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Check if email is valid
		if !isValidEmail(dto.Email) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
			return
		}

		// Check if email is already in use
		query, err := db.Query("SELECT * FROM users WHERE email = ?", dto.Email)
		if !query.Next() {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already in use"})
			return
		}

		// Check if password meets strong password requirements
		if !isStrongPassword(dto.Password) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 8 characters long and contain at " +
				"least one uppercase letter, one lowercase letter, one digit and one special character"})
			return
		}

		// Hash password
		hashedPassword, err := HashPassword(dto.Password)

		// Create new user in DB
		result, err := db.Exec("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
			dto.Name, dto.Email, hashedPassword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"Error inserting user into db": err.Error()})
			return
		}

		id, err := result.LastInsertId()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Generate JWT Auth Token
		token, err := utilities.GenerateAuthJWT(int(id))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Set Cookies
		c.SetCookie("auth_token", token, 3600, "/", "", false, true)

		c.JSON(http.StatusCreated, gin.H{
			"message": "User created successfully",
		})
		return
	}
}

// Login function for handling login, called by router
// Preconditions: receives a pointer to db
// Postconditions: If login is successful, returns HTTP 200 and sets JWT cookie, else returns an error response
func Login(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		var dto dtos.LoginDto

		// Bind and validate JSON
		if err := c.ShouldBindJSON(&dto); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Get user from DB filtering by email
		rows, err := db.Query("SELECT id, name, email, password FROM users WHERE email = ?", dto.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var users []models.User
		for rows.Next() {
			var user models.User
			err := rows.Scan(&user.Id, &user.Name, &user.Email, &user.Password)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			users = append(users, user)
		}

		// There should be exactly 1 result from this search; if there are 0, no user was found, if there is more than
		// 1, there are multiple users with the same email
		if len(users) != 1 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid email or password"})
			return
		}
		var user = users[0]

		// Verify if password is correct. If not return error
		if !isCorrectPassword(user.Password, dto.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		// Generate JWT auth token for user and set cookie
		token, err := utilities.GenerateAuthJWT(user.Id)
		c.SetCookie("auth_token", token, 3600, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{
			"message": "Login successful",
		})
		return
	}
}

// Logout function for handling removal of JWT auth cookie
// Preconditions: None
// Postconditions: Removes JWT from auth_token cookie and returns HTTP 200
func Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.SetCookie("auth_token", "", -1, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{
			"message": "Logout successful",
		})
		return
	}
}

// HashPassword Hash a password using the bcrypt algorithm.
// Preconditions: Receives a string containing the user password
// Postconditions: Returns string containing hashed password and error status
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// isStrongPassword Verify if a password contains the following:
// At least 8 characters, one lower case letter, one upper case letter, one digit and one special character
// Preconditions: Receives a string containing the user password
// Postconditions: Returns true if the input string matches the above requirements, else returns false
func isStrongPassword(password string) bool {
	var passwordRegex = regexp.MustCompile(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$`)
	return passwordRegex.MatchString(password)
}

// isCorrectPassword Verify if an input password matches the stored hashed password using bcrypt algorithm built into go
// Preconditions: Receives two strings: hashedPassword and password (plaintext)
// Postconditions: Returns true if the plaintext password matches the hashed password, else returns false
func isCorrectPassword(hashedPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// isValidEmail Verify if an email address is valid using go's built-in net/mail library
// Preconditions: Receives string containing email
// Postconditions: Returns true if input string is a valid email address, according to RFC 5322, else return false
func isValidEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}
