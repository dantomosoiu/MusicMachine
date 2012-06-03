<%@ WebHandler Language="C#" Class="UploadShowSongs" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;

public class UploadShowSongs : ServerResponse
{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;

        List<ReportedSong> p = new List<ReportedSong>();

        SongInfo song ;
        
        BasicInfo binfo;

       // Lyrics lyr;

        mydb.newQuery(" SELECT [Song].[song_id], [Song].[song_name], [Song].[artists], [Song].[album] , [Song].[album_id], [Song].[year], [Song].[genres], [Song].[duration] ,[Song].[lyrics] , [Song].[reporter_id],[Song].[report_date],[Song].[comment],[Song].[report_type] FROM [Song] WHERE [Song].[reporter_id] IS NOT NULL ");
                        
       
        sqlReader = mydb.ExecuteReader();
        while (sqlReader.Read())
        {
          //  lyr = new Lyrics(sqlReader["song_name"].ToString(), sqlReader["artists"].ToString(), sqlReader["lyrics"].ToString());
            song = new SongInfo(int.Parse(sqlReader["song_id"].ToString()), sqlReader["song_name"].ToString(), sqlReader["artists"].ToString(), sqlReader["album"].ToString(), int.Parse(sqlReader["year"].ToString()), sqlReader["genres"].ToString(), sqlReader["duration"].ToString(), -1, int.Parse(sqlReader["album_id"].ToString()));
            binfo = new BasicInfo(int.Parse(sqlReader["reporter_id"].ToString()),"test","test","test" );
            p.Add(new ReportedSong(binfo, song, sqlReader["report_date"].ToString(), sqlReader["report_type"].ToString(), sqlReader["comment"].ToString()));
           
        }
        
        
        context.Response.Write(JsonConvert.SerializeObject(p));
    }

}