<%@ WebHandler Language="C#" Class="AlbumSuggest" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;

public class AlbumSuggest : ServerResponse {
    MyDatabase mydb = new MyDatabase();
    Random r = new Random();

    protected override void Respond(HttpContext context)
    {
        int results = int.Parse(context.Request.Params["results"]);
        int user_id = int.Parse(context.Request.Params["user_id"]);
        int song_id = int.Parse(context.Request.Params["song_id"]);

        System.Diagnostics.Debug.WriteLine(song_id);
        
        mydb.newQuery("SELECT ISNULL(tab1.vote, -1) as vote, tab2.song_id, tab2.song_name, tab2.artists, tab2.album,"
            + " tab2.album_id, tab2.year, tab2.genres, tab2.duration"
            + " FROM (SELECT song_id, type as vote FROM Vote WHERE user_id=@user_id) as tab1 RIGHT OUTER JOIN"
            + " (SELECT s1.song_id, song_name, artists, album, album_id, year, genres, duration"
            + " FROM Song s1 WHERE s1.song_id != @song_id AND s1.album_id ="
            + " (SELECT album_id FROM Song WHERE song_id = @song_id)) as tab2 ON tab1.song_id = tab2.song_id");
        mydb.setParameter("song_id", song_id);
        mydb.setParameter("user_id", user_id);
        SqlDataReader reader = mydb.ExecuteReader();

        List<SongInfo> songs = new List<SongInfo>();
        while (reader.Read())
        {
            int songId = int.Parse(reader["song_id"].ToString());
            string songName = reader["song_name"].ToString();
            string artists = reader["artists"].ToString();
            string album = reader["album"].ToString();
            int albumId = int.Parse(reader["album_id"].ToString());
            int year = int.Parse(reader["year"].ToString());
            string genres = reader["genres"].ToString();
            string duration = reader["duration"].ToString();
            int vote = int.Parse(reader["vote"].ToString());

            System.Diagnostics.Debug.WriteLine(songName);
            songs.Add(new SongInfo(songId, songName, artists, album, year, genres, duration, vote, albumId));
        }

        List<int> songIndexes = new List<int>();
        for (int i = 0; i < songs.Count; ++i)
            songIndexes.Add(i);
        List<SongInfo> suggestedSongs = new List<SongInfo>();
        for (int i = 0; i < Math.Min(results, songs.Count); ++i)
        {
            int index = (int) (r.NextDouble() * songIndexes.Count);
            suggestedSongs.Add(songs[songIndexes[index]]);
            songIndexes[index] = songIndexes[songIndexes.Count - 1];
            songIndexes.RemoveAt(songIndexes.Count - 1);
        }

        System.Diagnostics.Debug.WriteLine("album:");
        for (int i = 0; i < suggestedSongs.Count; ++i)
            System.Diagnostics.Debug.WriteLine(suggestedSongs[i].SongName);

        context.Response.Write(JsonConvert.SerializeObject(suggestedSongs));
    }
}