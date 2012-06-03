<%@ WebHandler Language="C#" Class="FriendsGetProfile" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Collections.Generic;
using Newtonsoft.Json;

public class FriendsGetProfile : ServerResponse {

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

        //if (!Access.friendRelationship(context.Request.Params["friend_id"].ToString(), context.Session["user_id"].ToString()))
        //{
        //    errorMsg = "Access denied!";
        //    context.Response.Write(errorMsg);
        //    return;
        //}

        mydb.newQuery(" SELECT first_name, last_name, sex,  birth_date, location FROM [User] WHERE user_id = @friendid ");
        mydb.setParameter("friendid", context.Request.Params["friend_id"].ToString());

        reader = mydb.ExecuteReader();

        if (reader.HasRows)
        {
            int age;
            reader.Read();
            string firstName = reader["first_name"].ToString();
            string lastName = reader["last_name"].ToString();
            string sex = reader["sex"].ToString();
            string location = reader["location"].ToString();

            if (reader["birth_date"].ToString().Equals(""))
            {
                age = -1;
            }
            else
            {
                DateTime birthDate = DateTime.Parse(reader["birth_date"].ToString());
                age = CalculateAge(birthDate);
            }
            mydb.newQuery(
                "SELECT [Artist].[artist_name] " +
                "FROM [FavouriteArtists], [Artist] " +
                "WHERE [FavouriteArtists].[user_id] = @friendid AND [Artist].[artist_id] = [FavouriteArtists].[artist_id]"
            );
            mydb.setParameter("friendid", context.Request.Params["friend_id"].ToString());
            SqlDataReader artistReader = mydb.ExecuteReader();
            List<string> artistList = new List<string>();

            while (artistReader.Read())
            {
                artistList.Add(artistReader["artist_name"].ToString());
            }

            mydb.newQuery(
                "SELECT [Genre].[genre_name] " +
                "FROM [FavouriteGenres], [Genre] " +
                "WHERE [FavouriteGenres].[user_id] = @friendid AND [Genre].[genre_id] = [FavouriteGenres].[genre_id]"
            );
            mydb.setParameter("friendid", context.Request.Params["friend_id"].ToString());
            SqlDataReader genreReader = mydb.ExecuteReader();
            List<string> genreList = new List<string>();

            while (genreReader.Read())
            {
                genreList.Add(genreReader["genre_name"].ToString());
            }

            pInfo = new PersonalInfo(
                firstName,
                lastName,
                "",
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