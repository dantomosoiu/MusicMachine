<%@ WebHandler Language="C#" Class="UploadGetSongInfo" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;

public class UploadGetSongInfo : ServerResponse
{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;

        SongInfo song ;

        


        mydb.newQuery(" SELECT [Song].[song_id], [Song].[song_name], [Song].[artists], [Song].[album] , [Song].[album_id], [Song].[year], [Song].[genres], [Song].[duration] FROM [Song] WHERE [Song].[song_id] = @songid ");

        mydb.setParameter("songid", context.Request.Params["SongId"].ToString());
        
        sqlReader = mydb.ExecuteReader();
        sqlReader.Read();
        
        
         song = new SongInfo(int.Parse(sqlReader["song_id"].ToString()), sqlReader["song_name"].ToString(), sqlReader["artists"].ToString(), sqlReader["album"].ToString(), int.Parse(sqlReader["year"].ToString()), sqlReader["genres"].ToString(), sqlReader["duration"].ToString(), -1, int.Parse(sqlReader["album_id"].ToString()));
           
        
        
        
        context.Response.Write(JsonConvert.SerializeObject(song));
    }

}