<%@ WebHandler Language="C#" Class="LatestNews" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Globalization;

public class LatestNews : ServerResponse {

    MyDatabase mydb = new MyDatabase();

    public static int CompareFeed(FeedEntry f1, FeedEntry f2)
    {
       return f1.EventDateSort.CompareTo(f2.EventDateSort);
    }
    
    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;

        List<FeedEntry> list = new List<FeedEntry>();

        mydb.newQuery(" SELECT [Message].[message_id], [Message].[sender_id], [Message].[send_date], [Message].[title], " +
            "[Message].[body], [User].[email], [User].[first_name], [User].[last_name] " +
            "from [User] INNER JOIN [Message] on [User].[user_id] = [Message].[sender_id] where [Message].[receiver_id] = @id;");
        
        string s = context.Request.Params["UserId"];
        System.Diagnostics.Debug.WriteLine(s + "*");
        mydb.setParameter("id", s);
        sqlReader = mydb.ExecuteReader();
                
        while (sqlReader.Read())
        {
            int messageId = Int32.Parse(sqlReader["message_id"].ToString());
            int senderId = Int32.Parse(sqlReader["sender_id"].ToString());
            string messageTitle = sqlReader["title"].ToString();
            string messageBody = sqlReader["body"].ToString();
            DateTime sendDateDate = DateTime.Parse(sqlReader["send_date"].ToString());
            string sendDate = "(" + sendDateDate.ToString("MMMM", new CultureInfo("en-US")) + " " + sendDateDate.Day + ", " +
                sendDateDate.Year + ")";
            string email = sqlReader["email"].ToString();
            string firstName = sqlReader["first_name"].ToString();
            string lastName = sqlReader["last_name"].ToString();
            //System.Diagnostics.Debug.WriteLine("!Mesaj: " +  messageBody);
            
            list.Add(new FeedEntry("shoutbox_message", sendDate, sendDateDate, 
                new ShoutboxEntry(messageId, 
                    new BasicInfo(senderId, firstName, lastName, email), sendDate, messageTitle, messageBody) ));
            
        }

        mydb.newQuery("Select f.sender_id, f.send_date, f.decision_date, f.status, " +
              "s.email, s.first_name, s.last_name " +
              "from [FriendRequests] f INNER JOIN [User] s on f.sender_id = s.user_id where f.receiver_id = @id " +
              "and f.status != 'declined';");
        
        mydb.setParameter("id", s);
        sqlReader = mydb.ExecuteReader();
        
        while (sqlReader.Read()) 
        {
            int senderId = Int32.Parse(sqlReader["sender_id"].ToString()); 
            string senderFirstName = sqlReader["first_name"].ToString();
            string senderLastName = sqlReader["last_name"].ToString();
            string senderEmail = sqlReader["email"].ToString();
            string status = sqlReader["status"].ToString(); 
            DateTime date;
            string sendDate;
            if (status == "accepted") {
                date = DateTime.Parse(sqlReader["decision_date"].ToString());
                sendDate = "("  + date.ToString("MMMM", new CultureInfo("en-US")) + " " + date.Day + ", " +
                    + date.Year + ")";
            }
            else {
                date = DateTime.Parse(sqlReader["send_date"].ToString());
                sendDate = "(" + date.ToString("MMMM", new CultureInfo("en-US")) + " " + date.Day + ", " +
                    + date.Year + ")";
            }
            
            //System.Diagnostics.Debug.WriteLine("FriendRequest: " +  senderFirstName + " " + senderLastName);
            
            list.Add(new FeedEntry("friend_request", sendDate, date, 
                new FriendRequest(new BasicInfo(senderId, senderFirstName, senderLastName, senderEmail), status)));
        }

        mydb.newQuery("(SELECT f.user_id AS sender_id, f.first_name AS sender_first_name, f.last_name AS sender_last_name, " +
            "u.user_id AS receiver_id, u.first_name AS receiver_first_name, u.last_name AS receiver_last_name, " +
            "r.song_id, r.send_date, s.song_name, s.artists, s.album, s.album_id, s.year, s.genres, s.duration, " +
            "ISNULL(v.type, -1) AS vote_type " +
            "FROM [User] AS u INNER JOIN Recommendation AS r ON u.user_id = r.receiver_id INNER JOIN " +
            "[User] AS f ON r.sender_id = f.user_id INNER JOIN Song AS s ON s.song_id = r.song_id LEFT OUTER JOIN " +
            "(SELECT type, song_id FROM Vote WHERE (user_id = @id)) AS v ON r.song_id = v.song_id " +
            "WHERE (u.user_id = @id)) " +
            "UNION " +
            "(SELECT u.user_id AS sender_id, u.first_name AS sender_first_name, u.last_name AS sender_last_name, " +
            "f.user_id AS receiver_id, f.first_name AS receiver_first_name, f.last_name AS receiver_last_name, " +
            "r.song_id, r.send_date, s.song_name, s.artists, s.album, s.album_id, s.year, s.genres, s.duration, " +
            "ISNULL(v.type, - 1) AS vote_type " +
            "FROM [User] AS u INNER JOIN Recommendation AS r ON u.user_id = r.sender_id INNER JOIN " +
            "[User] AS f ON r.receiver_id = f.user_id INNER JOIN Friends AS fr ON fr.user1_id = f.user_id INNER JOIN " +
            "Song AS s ON s.song_id = r.song_id LEFT OUTER JOIN " +
            "(SELECT song_id, type FROM Vote WHERE (user_id = @id)) AS v ON v.song_id = r.song_id " +
            "WHERE (fr.user2_id = @id) AND (u.user_id <> @id))" +
            "UNION " +
            "(SELECT f.user_id AS sender_id, f.first_name AS sender_first_name, f.last_name AS sender_last_name, " +
            "u.user_id AS receiver_id, u.first_name AS receiver_first_name, u.last_name AS receiver_last_name, " +
            "r.song_id, r.send_date, s.song_name, s.artists, s.album, s.album_id, s.year, s.genres, s.duration, " +
            "ISNULL(v.type, - 1) AS vote_type " +
            "FROM [User] AS u INNER JOIN Recommendation AS r ON u.user_id = r.receiver_id INNER JOIN " +
            "[User] AS f ON r.sender_id = f.user_id INNER JOIN Friends AS fr ON fr.user1_id = f.user_id INNER JOIN " +
            "Song AS s ON s.song_id = r.song_id LEFT OUTER JOIN " +
            "(SELECT song_id, type FROM  Vote WHERE (user_id = @id)) AS v ON v.song_id = r.song_id " +
            "WHERE (fr.user2_id = @id) AND (u.user_id <> @id));");

        mydb.setParameter("id", s);
        sqlReader = mydb.ExecuteReader();

        while (sqlReader.Read())
        {
            int senderId = Int32.Parse(sqlReader["sender_id"].ToString());
            string senderFirstName = sqlReader["sender_first_name"].ToString();
            string senderLastName = sqlReader["sender_last_name"].ToString();
            string senderEmail = null;
            DateTime sendDateDate = DateTime.Parse(sqlReader["send_date"].ToString());
            string sendDate = "(" + sendDateDate.ToString("MMMM", new CultureInfo("en-US")) + " " + sendDateDate.Day + ", " +
                sendDateDate.Year + ")";
            int receiverId = Int32.Parse(sqlReader["receiver_id"].ToString());
            string receiverFirstName = sqlReader["receiver_first_name"].ToString();
            string receiverLastName = sqlReader["receiver_last_name"].ToString();
            string receiverEmail = null;
            int songId = Int32.Parse(sqlReader["song_id"].ToString());
            string songName = sqlReader["song_name"].ToString();
            string artists = sqlReader["artists"].ToString();
            string album = sqlReader["album"].ToString();
            int year = Int32.Parse(sqlReader["year"].ToString());
            string genres = sqlReader["genres"].ToString();
            string duration = sqlReader["duration"].ToString();
            int voteType = Int32.Parse(sqlReader["vote_type"].ToString());
            int albumId = Int32.Parse(sqlReader["album_id"].ToString());
            
            //System.Diagnostics.Debug.WriteLine("RecommendedSong: " +  artists + " " + songName);

            list.Add(new FeedEntry("recommendation", sendDate, sendDateDate,
                new RecommendedSong(new BasicInfo(senderId, senderFirstName, senderLastName, senderEmail),
                    new BasicInfo(receiverId, receiverFirstName, receiverLastName, receiverEmail),
                        new SongInfo(songId, songName, artists, album, year, genres, duration, voteType, albumId))));
        }


        list.Sort(CompareFeed);
        list.Reverse(0, list.Count);
        List<FeedEntry> latestNewsList = new List<FeedEntry>();
        for (int i = 0; i < list.Count && i < 50; i++)
            latestNewsList.Add(list[i]);
        
        context.Response.Write(JsonConvert.SerializeObject(latestNewsList));
    }
}