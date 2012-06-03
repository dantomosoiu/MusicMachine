<%@ WebHandler Language="C#" Class="PlaylistInsert" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Web.Security;


public class PlaylistInsert : ServerResponse
{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
            
        mydb.newQuery("INSERT INTO [Playlist] (playlist_name,owner_id) VALUES (@name_playlist,@id_user) ");

        mydb.setParameter("name_playlist", context.Request.Params["PlaylistName"].ToString());

        //asa ar trebui facut ca sa iei user id-ul curent
        //MembershipUser m;
        //if ((m = Membership.GetUser()) != null)
        //{
        //    string user_id = m.ProviderUserKey.ToString();
        //    mydb.setParameter("id_user", user_id);
        //}

        //e facuta la misto asta de aici
        mydb.setParameter("id_user", context.Request.Params["UserId"].ToString());
        
        mydb.ExecuteNonQuery();

        //aici trebuie facut altfel deoarece chestia asta ia ultimul id introdus de oricine in toata baza de date
        //int Playlist_Id = mydb.GetLastInsertId();
        //nu stiu inca daca am ce face cu chestia asta , probabil o sa fac un search pe tabelul playlists dupa nume
        
        context.Response.Write("{}");
    }

}