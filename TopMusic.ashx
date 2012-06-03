<%@ WebHandler Language="C#" Class="TopMusic" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Globalization;

public class TopMusic : ServerResponse
{
    MyDatabase mydb = new MyDatabase();

    protected override void Respond(HttpContext context)
    {
        List<SongCount> l = new List<SongCount>();
        string userId = context.Request.Params["UserId"];
        int type = Int32.Parse(context.Request.Params["Type"]);
        string friendsOnly = context.Request.Params["FriendsOnly"].ToString();

        string query = "";
        if (friendsOnly.Equals("false"))
            query = "SELECT a.song_id, a.song_name, a.artists, a.album_id, a.album, a.year, a.genres, a.duration, a.listen, " +
                "ISNULL(b.type, - 1) AS Vot FROM " +
                "(SELECT s.song_id, s.song_name, s.artists, s.album_id, s.album, s.year, s.genres, s.duration, h.listen " +
                  "FROM Song AS s INNER JOIN  (SELECT song_id, COUNT(song_id) AS listen " +
                        "FROM NewHistory WHERE (listen_date > DATEADD(day, @daysBefore, GETDATE())) " +
                        "GROUP BY song_id) AS h ON s.song_id = h.song_id) AS a LEFT OUTER JOIN " +
                            "(SELECT song_id, type FROM Vote WHERE (user_id = @userId)) AS b ON a.song_id = b.song_id " +
                            "ORDER BY a.listen DESC;";
        else
            query = "SELECT a.song_id, a.song_name, a.artists, a.album_id, a.album, a.year, a.genres, a.duration, a.listen, " +
                "ISNULL(b.type, - 1) AS Vot FROM " +
                "(SELECT s.song_id, s.song_name, s.artists, s.album_id, s.album, s.year, s.genres, s.duration, h.listen " +
                  "FROM Song AS s INNER JOIN  (SELECT song_id, COUNT(song_id) AS listen " +
                        "FROM NewHistory WHERE (listen_date > DATEADD(day, @daysBefore, GETDATE())) " +
                        "AND (user_id IN  (SELECT user2_id FROM Friends WHERE (user1_id = @userId))) " +
                        "GROUP BY song_id) AS h ON s.song_id = h.song_id) AS a LEFT OUTER JOIN " +
                            "(SELECT song_id, type FROM Vote WHERE (user_id = @userId)) AS b ON a.song_id = b.song_id " +
                            "ORDER BY a.listen DESC;";

        mydb.newQuery(query);
        mydb.setParameter("userId", userId);
        int days = -7;
        switch (type)
        {
            case 0: days = -7; break;
            case 1: days = -30; break;
            case 2: days = -365; break;
        }
        mydb.setParameter("daysBefore", days);

        SqlDataReader reader = mydb.ExecuteReader();
        while (reader.Read())
        {
            int songId = Int32.Parse(reader["song_id"].ToString());
            string songName = reader["song_name"].ToString();
            string artists = reader["artists"].ToString();
            int albumId = Int32.Parse(reader["album_id"].ToString());
            string album = reader["album"].ToString();
            int year = Int32.Parse(reader["year"].ToString());
            string genres = reader["genres"].ToString();
            string duration = reader["duration"].ToString();
            int listenCount = Int32.Parse(reader["listen"].ToString());
            int voteType = Int32.Parse(reader["Vot"].ToString());
            l.Add(new SongCount(songId, songName, artists, album, year, genres, duration, listenCount, voteType, albumId));
        }

        List<SongCount> topList = new List<SongCount>();
        for (int i = 0; i < l.Count && i < 100; i++)
            topList.Add(l[i]);

        context.Response.Write(JsonConvert.SerializeObject(topList));
    }
}