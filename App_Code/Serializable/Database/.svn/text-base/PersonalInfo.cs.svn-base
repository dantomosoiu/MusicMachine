using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Se foloseste pentru vizualizarea profilului unui utilizator.
/// </summary>
public class PersonalInfo
{
    public string UserId;
    public string FirstName, LastName;
    public string Email;
    public string Sex;
    public int Age;
    public string Location;
    public List<string> FavouriteArtists;
    public List<string> FavouriteGenres;

	public PersonalInfo(string FirstName, string LastName, string Email, string Sex,
        int Age, string Location, List<string> FavouriteArtists, List<string> FavouriteGenres)
	{
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
        this.Sex = Sex;
        this.Age = Age;
        this.Location = Location;
        this.FavouriteArtists = FavouriteArtists;
        this.FavouriteGenres = FavouriteGenres;
	}

        public PersonalInfo(string UserId, string FirstName, string LastName, string Sex,
        int Age, string Location)
        {
                this.UserId = UserId;
                this.FirstName = FirstName;
                this.LastName = LastName;             
                this.Sex = Sex;
                this.Age = Age;
                this.Location = Location;
        }
}