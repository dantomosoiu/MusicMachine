<%@ WebHandler Language="C#" Class="PlayerSongHistory" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Web.Security;


public class PlayerSongHistory : ServerResponse
{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
            
        mydb.newQuery("INSERT INTO [NewHistory] (user_id,song_id,listen_date,source) VALUES (@id_user,@id_song,@date_listen,@source) ");

        mydb.setParameter("id_song", context.Request.Params["SongId"].ToString());
        mydb.setParameter("date_listen", DateTime.Now);
        mydb.setParameter("id_user", context.Session["user_id"].ToString());
        mydb.setParameter("source", context.Request.Params["source"].ToString());
        
        mydb.ExecuteNonQuery();

        //aici trebuie facut altfel deoarece chestia asta ia ultimul id introdus de oricine in toata baza de date
        //int Playlist_Id = mydb.GetLastInsertId();
        //nu stiu inca daca am ce face cu chestia asta , probabil o sa fac un search pe tabelul playlists dupa nume
        
        context.Response.Write("{}");
    }

}