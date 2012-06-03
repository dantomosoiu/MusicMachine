<%@ WebHandler Language="C#" Class="MyProfileSearchGenre" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Collections.Generic;
using Newtonsoft.Json;

public class MyProfileSearchGenre : ServerResponse {

    protected override void Respond(HttpContext context)
    {
        List<String> options = new List<String>();
        MyDatabase mydb = new MyDatabase();
        SqlDataReader reader;
        
        mydb.newQuery(
            "SELECT [Genre].[genre_name] " +
            "FROM [Genre] " +
            "WHERE [Genre].[genre_name] LIKE '%' + @term + '%'"
           
            );

        mydb.setParameter("userid", context.Session["user_id"].ToString());
        mydb.setParameter("term", context.Request.Params["term"]);
        
        reader = mydb.ExecuteReader();
        if (reader.HasRows)
        {
            while (reader.Read())
            {
                options.Add(reader["genre_name"].ToString());
            }
            
        }
        context.Response.Write(JsonConvert.SerializeObject(options));
    }

}