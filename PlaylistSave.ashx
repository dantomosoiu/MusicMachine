<%@ WebHandler Language="C#" Class="PlaylistSave" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Web.Security;


public class PlaylistSave : ServerResponse
{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        int i = 0;

        string[] Song_Ids = context.Request.Params.GetValues(1);
        string[] Playlist_Positions = context.Request.Params.GetValues(2);

        //aici trebuie facut altfel deoarece chestia asta ia ultimul id introdus de oricine in toata baza de date
        int Playlist_Id = int.Parse(context.Request.Params["PlaylistId"]);
       
        for ( i = 0 ; i < Song_Ids.Length ; i++ )
        {
         mydb.newQuery("INSERT INTO [Contains] (playlist_id,song_id,playlist_position) VALUES (@playlistid,@songid,@playlistposition) ");

         mydb.setParameter("playlistid", Playlist_Id);   
         mydb.setParameter("songid", Song_Ids[i]);
         mydb.setParameter("playlistposition", Playlist_Positions[i]);       
         mydb.ExecuteNonQuery();
        }

        context.Response.Write("{}");
    }

}