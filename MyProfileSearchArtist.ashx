<%@ WebHandler Language="C#" Class="MyProfileSearchArtist" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Collections.Generic;
using Newtonsoft.Json;

public class MyProfileSearchArtist : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        List<String> options = new List<String>();
        MyDatabase mydb = new MyDatabase();
        SqlDataReader reader;
        
        //mydb.newQuery(
        //    "SELECT [Artist].[artist_name] " +
        //    "FROM [FavouriteArtists] " +
        //    "JOIN [Artist] ON [Artist].[artist_id] = [FavouriteArtists].[artist_id] " +
        //    "WHERE [FavouriteArtists].[user_id] = @userid AND " +
        //    "[Artist].[artist_name] LIKE '%' + @term + '%'"
           
        //    );

        mydb.newQuery(
           "SELECT [Artist].[artist_name] " +
           "FROM [Artist] " +
           "WHERE [Artist].[artist_name] LIKE '%' + @term + '%'"

           );

        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("term", context.Request.Params["term"]);
        
        reader = mydb.ExecuteReader();
        if (reader.HasRows)
        {
            while (reader.Read())
            {
                options.Add(reader["artist_name"].ToString());
            }
            
        }
        context.Response.Write(JsonConvert.SerializeObject(options));
    }

}