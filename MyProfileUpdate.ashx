<%@ WebHandler Language="C#" Class="MyProfileUpdate" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Collections.Generic;

public class MyProfileUpdate : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();

        mydb.newQuery("UPDATE [User] SET first_name = @fn, last_name = @ln, sex = @s, location = @l WHERE user_id = @userid");
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("fn", context.Request.Params["first_name"]);
        mydb.setParameter("ln", context.Request.Params["last_name"]);
        mydb.setParameter("s", context.Request.Params["sex"]);
        mydb.setParameter("l", context.Request.Params["location"]);

        mydb.ExecuteNonQuery();

        mydb.newQuery(
            "DELETE FROM [FavouriteArtists] " +
            "WHERE user_id = @userid");
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.ExecuteNonQuery();


        mydb.newQuery(
            "SELECT [artist_id] " +
            "FROM [Artist] " +
            "WHERE [artist_name] = @artist1 OR [artist_name] = @artist2 OR [artist_name] = @artist3"
        );
        mydb.setParameter("artist1", context.Request["artist1"].ToString());
        mydb.setParameter("artist2", context.Request["artist2"].ToString());
        mydb.setParameter("artist3", context.Request["artist3"].ToString());
        SqlDataReader artistIdReader = mydb.ExecuteReader();

        List<string> artistId = new List<string>();
        
        while (artistIdReader.Read())
        {
            artistId.Add(artistIdReader["artist_id"].ToString());
        }
        
        foreach(string artist in artistId)
        {
            mydb.newQuery(
                "INSERT INTO [FavouriteArtists] ([user_id], [artist_id]) " +
                "VALUES (@userid, @artistid)"
            );
            mydb.setParameter("userid", context.Session["user_id"].ToString());
            mydb.setParameter("artistid", artist);
            mydb.ExecuteNonQuery();
        }
        
        
        mydb.newQuery(
           "DELETE FROM [FavouriteGenres] " +
           "WHERE user_id = @userid");
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.ExecuteNonQuery();

        mydb.newQuery(
            "SELECT [genre_id] " +
            "FROM [Genre] " +
            "WHERE [genre_name] = @genre1 OR [genre_name] = @genre2 OR [genre_name] = @genre3"
        );
        mydb.setParameter("genre1", context.Request["genre1"].ToString());
        mydb.setParameter("genre2", context.Request["genre2"].ToString());
        mydb.setParameter("genre3", context.Request["genre3"].ToString());
        SqlDataReader genreIdReader = mydb.ExecuteReader();

        List<string> genreId = new List<string>();

        while (genreIdReader.Read())
        {
            genreId.Add(genreIdReader["genre_id"].ToString());
        }
        
        foreach (string genre in genreId) 
        {
            mydb.newQuery(
                "INSERT INTO [FavouriteGenres] ([user_id], [genre_id]) " +
                "VALUES (@userid, @genreid)"
            );
            mydb.setParameter("userid", context.Session["user_id"].ToString());
            mydb.setParameter("genreid", genre);
            mydb.ExecuteNonQuery();
        }
        
        
        context.Session["first_name"] = context.Request.Params["first_name"];
        context.Session["last_name"] = context.Request.Params["last_name"];

        context.Response.Write("true");

        
    }

}