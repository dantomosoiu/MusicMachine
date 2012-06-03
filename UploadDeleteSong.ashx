<%@ WebHandler Language="C#" Class="UploadDeleteSong" %>

using System;
using System.IO;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;





public class UploadDeleteSong: ServerResponse{

    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;
        int i;
        List<int> genre_ids = new List<int>();

        mydb.newQuery("SELECT [HasGenre].[genre_id] FROM [HasGenre] WHERE [HasGenre].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        sqlReader = mydb.ExecuteReader();

        while (sqlReader.Read())
        {
            genre_ids.Add(int.Parse(sqlReader["genre_id"].ToString()));
        }
        
        i = 0;
        while (i < genre_ids.Count)
        {

            mydb.newQuery("SELECT [ArtistsGenres].[songs_count] FROM [ArtistsGenres] WHERE [ArtistsGenres].[genre_id] = @genid");

            mydb.setParameter("genid", genre_ids[i]);
            sqlReader = mydb.ExecuteReader();
            
            sqlReader.Read();
            int songcount = int.Parse(sqlReader["songs_count"].ToString());
            songcount--;

            mydb.newQuery("UPDATE [ArtistsGenres] SET [ArtistsGenres].[songs_count]=@songcount WHERE  [ArtistsGenres].[genre_id] = @gen_id ");
            
            mydb.setParameter("gen_id", genre_ids[i]);
            mydb.setParameter("songcount", songcount);

            mydb.ExecuteNonQuery();
            
            i++;
        }

        mydb.newQuery("DELETE FROM [FavouriteSongs] WHERE [FavouriteSongs].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();

        mydb.newQuery("DELETE FROM [Vote] WHERE [Vote].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();

        mydb.newQuery("DELETE FROM [NewHistory] WHERE [NewHistory].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();

        mydb.newQuery("DELETE FROM [OldHistory] WHERE [OldHistory].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();

        mydb.newQuery("DELETE FROM [Recommendation] WHERE [Recommendation].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();
                
        mydb.newQuery("DELETE FROM [Sings] WHERE [Sings].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();

        mydb.newQuery("DELETE FROM [HasGenre] WHERE [HasGenre].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();
        
        mydb.newQuery("DELETE FROM [Contains] WHERE [Contains].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();
        
        mydb.newQuery("DELETE FROM [Song] WHERE [Song].[song_id] = @id");

        mydb.setParameter("id", context.Request.Params["SongId"].ToString());

        mydb.ExecuteNonQuery();

        int songId = int.Parse(context.Request.Params["SongId"].ToString());

        string path = context.Server.MapPath(@"~/music/");  
        File.Delete(path + songId + ".mp3");        
        
        SongInfo song = new SongInfo(songId, "Delete", "Delete", "", 1, "", "", -1, 1);
        context.Response.Write(JsonConvert.SerializeObject(song));
    }

}