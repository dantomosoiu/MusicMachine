<%@ WebHandler Language="C#" Class="LyricsPanel" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient; 


public class LyricsPanel : ServerResponse
{
    MyDatabase mydb = new MyDatabase();
    
    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;
        mydb.newQuery(" SELECT artists , song_name , lyrics FROM Song where song_id = @id ");
        
        
        mydb.setParameter("id", context.Request.Params["SongId"].ToString()); 
     
        sqlReader = mydb.ExecuteReader();
        sqlReader.Read();
        Lyrics lyr = new Lyrics(sqlReader["song_name"].ToString(), sqlReader["artists"].ToString(), sqlReader["lyrics"].ToString());
       // Lyrics l = new Lyrics(sqlReader["song_name"].ToString(), sqlReader["artists"].ToString(), sqlReader["lyrics"].ToString());
       
       
        
     context.Response.Write(JsonConvert.SerializeObject(lyr));
    }

}