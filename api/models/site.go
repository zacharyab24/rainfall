package models

type Site struct {
	Id       int      `json:"id"`
	Name     string   `json:"name"`
	Location string   `json:"location"`
	OwnerId  int      `json:"ownerId"`
	Rainfall Rainfall `json:"rainfall"`
}
