<%@ WebHandler Language="C#" Class="VoteSong" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;

public class VoteSong : ServerResponse {
    
   MyDatabase mydb = new MyDatabase();

   protected override void Respond(HttpContext context)
   {

       mydb.newQuery("DELETE FROM [Vote] WHERE user_id = @id_user AND song_id = @id_song");

       mydb.setParameter("id_user", context.Session["user_id"].ToString());
       mydb.setParameter("id_song", context.Request.Params["SongId"].ToString());

       mydb.ExecuteNonQuery();

       mydb.newQuery("INSERT INTO [Vote] (user_id, song_id, type, vote_date) VALUES (@id_user, @id_song, @vote, @date)");
       mydb.setParameter("id_user", context.Session["user_id"].ToString());
       mydb.setParameter("id_song", context.Request.Params["SongId"].ToString());
       mydb.setParameter("vote", context.Request.Params["Vote"].ToString());
       mydb.setParameter("date", DateTime.Now);

       mydb.ExecuteNonQuery();

       context.Response.Write("{}");

   }
}