<%@ WebHandler Language="C#" Class="PlaylistSongsPanel" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;

public class PlaylistSongsPanel : ServerResponse
{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;

        List<SongInfo> p = new List<SongInfo>();

        int i = 0;
        
      //  public SongInfo(int SongId, string SongName, string Artists, string Album, int Year, string Genres, string Duration) 
      // trebuie scos din baza de date si facut join intre playlist_id , song_id si tabelul asta cu songs

        //mydb.newQuery(" SELECT Song.song_id, Song.song_name, Song.artists, Song.album, Song.year, Song.genres, Song.duration, ContainsSong.playlist_position FROM Playlist INNER JOIN ContainsSong on ContainsSong.playlist_id = Playlist.playlist_id INNER JOIN Song on ContainsSong.song_id = Song.song_id where Playlist.playlist_id = @id ");

        
        mydb.newQuery(" SELECT [Song].[song_id], [Song].[song_name], [Song].[artists], [Song].[album] , [Song].[album_id], [Song].[year], [Song].[genres], [Song].[duration], [Contains].[playlist_position] FROM [Playlist] INNER JOIN [Contains] on [Contains].[playlist_id] = [Playlist].[playlist_id] INNER JOIN [Song] on [Contains].[song_id] = [Song].[song_id] where [Playlist].[playlist_id] = @id order by [Contains].[playlist_position] ");

                
        mydb.setParameter("id", context.Request.Params["PlaylistId"].ToString());

        sqlReader = mydb.ExecuteReader();
        while (sqlReader.Read())
        {
            //divul ia valoarea  sqlReader["lyrics"].toString();
            // aici trebuie construit jsonul
            
            
            //daca Song.Year e null imi da exceptie parsarea la int, solutia de moment a fost sa completez toti anii cu 0
            p.Add(new SongInfo(int.Parse(sqlReader["song_id"].ToString()), sqlReader["song_name"].ToString(), sqlReader["artists"].ToString(), sqlReader["album"].ToString(), int.Parse(sqlReader["year"].ToString()), sqlReader["genres"].ToString(), sqlReader["duration"].ToString(),-1,int.Parse(sqlReader["album_id"].ToString())));
            i++;
        }
        
                
        i=0;
        while (i < p.Count)
        {
            mydb.newQuery("SELECT [Vote].[type] FROM [Vote] WHERE [Vote].[song_id] = @songid AND [Vote].[user_id] = @userid ");
            mydb.setParameter("userid", context.Request.Params["UserId"].ToString());
            mydb.setParameter("songid", p[i].SongId);
            sqlReader = mydb.ExecuteReader();
            if (sqlReader.HasRows){
                sqlReader.Read();
                p[i].Vote = int.Parse(sqlReader["type"].ToString());
            }
            i++;
        }



        context.Response.Write(JsonConvert.SerializeObject(p));
    }

}

