package models

type Rainfall struct {
	Id        int    `json:"id"`
	Quantity  int    `json:"quantity"`
	Date      string `json:"date"`
	UpdatedAt string `json:"updatedAt"`
	SiteId    int    `json:"siteId"`
}
