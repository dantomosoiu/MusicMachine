<%@ WebHandler Language="C#" Class="MyProfileInfo" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Collections.Generic;
using Newtonsoft.Json;

public class MyProfileInfo : ServerResponse {

    public static int CalculateAge(DateTime BirthDate)
    {
        int YearsPassed = DateTime.Now.Year - BirthDate.Year;
        if (DateTime.Now.Month < BirthDate.Month || (DateTime.Now.Month == BirthDate.Month && DateTime.Now.Day < BirthDate.Day))
        {
            YearsPassed--;
        }
        return YearsPassed;
    }

    protected override void Respond(HttpContext context)
    {
        SqlDataReader reader;
        PersonalInfo pInfo;
        MyDatabase mydb = new MyDatabase();
        
        
        mydb.newQuery(" SELECT first_name, last_name, email, sex,  birth_date, location FROM [User] WHERE user_id = @userid ");
        mydb.setParameter("userid", context.Session["user_id"].ToString());

        reader = mydb.ExecuteReader();


        
        
        if (reader.HasRows)
        {
            int age;
            reader.Read();
            string firstName = reader["first_name"].ToString();
            string lastName = reader["last_name"].ToString();
            string email = reader["email"].ToString();
            string sex = reader["sex"].ToString();
            string location = reader["location"].ToString();
                  
            if (!reader["birth_date"].ToString().Equals(""))
            {
                DateTime birthDate = DateTime.Parse(reader["birth_date"].ToString());
                age = CalculateAge(birthDate);
            }
            else
            {
                age = -1;
            }
                
            
            mydb.newQuery(
                "SELECT [Artist].[artist_name] " +
                "FROM [FavouriteArtists], [Artist] " +
                "WHERE [FavouriteArtists].[user_id] = @userid AND [Artist].[artist_id] = [FavouriteArtists].[artist_id]"
            );
            mydb.setParameter("userid", context.Session["user_id"].ToString());
            SqlDataReader artistReader = mydb.ExecuteReader();
            List<string> artistList = new List<string>();
            
            while (artistReader.Read())
            {
                artistList.Add(artistReader["artist_name"].ToString());
            }

            mydb.newQuery(
                "SELECT [Genre].[genre_name] " +
                "FROM [FavouriteGenres], [Genre] " +
                "WHERE [FavouriteGenres].[user_id] = @userid AND [Genre].[genre_id] = [FavouriteGenres].[genre_id]"
            );
            mydb.setParameter("userid", context.Session["user_id"].ToString());
            SqlDataReader genreReader = mydb.ExecuteReader();
            List<string> genreList = new List<string>();

            while (genreReader.Read())
            {
                genreList.Add(genreReader["genre_name"].ToString());
            }
                
            pInfo = new PersonalInfo(
                firstName,
                lastName,
                email,
                sex,
                age,
                location,
                artistList,
                genreList
            );
            context.Response.Write(JsonConvert.SerializeObject(pInfo));
        }
        else
        {
            context.Response.Write(JsonConvert.SerializeObject("false"));
        }
        
    }

}