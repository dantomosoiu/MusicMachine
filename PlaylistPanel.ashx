<%@ WebHandler Language="C#" Class="PlaylistPanel" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;


public class PlaylistPanel : ServerResponse
{
    MyDatabase mydb = new MyDatabase();
    
    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;

        List<Playlist> p = new List<Playlist>(); 

        int i=0;
        mydb.newQuery(" SELECT playlist_id, playlist_name FROM Playlist WHERE owner_id = @id ORDER BY playlist_id");
        
        
        mydb.setParameter("id", context.Request.Params["UserId"].ToString());
        
        sqlReader = mydb.ExecuteReader();
        while (sqlReader.Read())
        {
            p.Add(new Playlist(int.Parse(sqlReader["playlist_id"].ToString()) , sqlReader["playlist_name"].ToString()));
            i++;
        }
    
                
        context.Response.Write(JsonConvert.SerializeObject(p));
    }

}