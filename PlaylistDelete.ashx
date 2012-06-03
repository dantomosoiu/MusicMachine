<%@ WebHandler Language="C#" Class="PlaylistDelete" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;


public class PlaylistDelete: ServerResponse{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        mydb.newQuery("DELETE FROM [Contains] WHERE playlist_id = @id_playlist");

        mydb.setParameter("id_playlist", context.Request.Params["PlaylistId"].ToString());

        mydb.ExecuteNonQuery();
           
        mydb.newQuery("DELETE FROM [Playlist] WHERE playlist_id = @id_playlist");

        mydb.setParameter("id_playlist", context.Request.Params["PlaylistId"].ToString());
        
        mydb.ExecuteNonQuery();
        
        context.Response.Write("{}");
    }

}