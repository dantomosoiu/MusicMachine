<%@ WebHandler Language="C#" Class="PlaylistRename" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;


public class PlaylistRename: ServerResponse{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        mydb.newQuery("UPDATE [Playlist] SET playlist_name = @name_playlist WHERE playlist_id = @id_playlist");

        mydb.setParameter("id_playlist", context.Request.Params["PlaylistId"].ToString());
        mydb.setParameter("name_playlist", context.Request.Params["PlaylistName"].ToString());

        mydb.ExecuteNonQuery();
        
        context.Response.Write("{}");
    }

}