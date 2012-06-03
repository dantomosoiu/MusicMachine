<%@ WebHandler Language="C#" Class="SmartSuggest" %>

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Xml;
using System.Xml.XPath;
using System.Net;
using System.IO;
using System.Data.SqlClient;
using Newtonsoft.Json;


/// <summary>
/// Summary description for SmartSuggest
/// </summary>
/// 

public class SmartSuggest : ServerResponse
{
    MyDatabase mydb = new MyDatabase();
    Random random = new Random();
    public const int MAX_TRIALS = 10;


    public int Comparer(KeyValuePair<int, double> a, KeyValuePair<int, double> b)
    {
        double diff = b.Value - a.Value;
        if (diff < 0)
            return -1;
        if (diff > 0)
            return 1;
        return 0;
    }

    protected double GetSongCountWeight(double x)
    {
        return 2*Math.Pow(x, (double) 1/3)-1;
    }

    protected Dictionary<int, double> UpdateArtistsWeights(int user_id)
    {
        mydb.newQuery("DELETE FROM ArtistWeights WHERE user_id=@user_id");
        mydb.setParameter("user_id", user_id);
        mydb.ExecuteNonQuery();
                
        Dictionary<int, double> VoteWeights = new Dictionary <int, double> ();
        Dictionary<int, double> HistoryWeights = new Dictionary<int, double> ();
        Dictionary<int, double> TotalWeights = new Dictionary<int, double>();

        mydb.newQuery("(SELECT DISTINCT artist_id FROM NewHistory nh, Sings s"
            + " WHERE nh.song_id = s.song_id AND user_id=@user_id)"
            + " UNION (SELECT DISTINCT artist_id FROM Vote v, Sings s"
            + " WHERE v.song_id = s.song_id AND user_id=@user_id)"
            + " UNION (SELECT DISTINCT artist_id FROM FavouriteSongs fs, Sings s"
            + " WHERE fs.song_id = s.song_id AND user_id=@user_id)"
            + " UNION (SELECT artist_id FROM FavouriteArtists WHERE user_id=@user_id)");
        mydb.setParameter("user_id", user_id);
        SqlDataReader reader = mydb.ExecuteReader();

        while (reader.Read())
        {
            int artistId = Int32.Parse(reader["artist_id"].ToString());
            VoteWeights.Add(artistId, 0);
            HistoryWeights.Add(artistId, -1);
        }

        // Calculez ponderile in functie de voturi
        
        // Calculez ponderea in functie de voturile pe melodie
        mydb.newQuery("SELECT artist_id, SUM(numarator)/SUM(numitor) as medie"
            + " FROM (SELECT s.artist_id,"
            + " CASE type WHEN 0 THEN -1*1 WHEN 1 THEN -0.35*0.5 WHEN 2 THEN 0.1*0.25 WHEN 3 THEN 0.45*0.5 WHEN 4 THEN 0.95*1 END AS numarator,"
            + " CASE type WHEN 0 THEN 1 WHEN 1 THEN 0.5 WHEN 2 THEN 0.25 WHEN 3 THEN 0.5 WHEN 4 THEN 1 END AS numitor"
                    + " FROM Vote v, Sings s"
                    + " WHERE (v.song_id = s.song_id) AND (v.user_id=@user_id) AND (v.song_id NOT IN"
                    + " (SELECT song_id FROM FavouriteSongs WHERE (user_id=@user_id)))"
                    + " UNION ALL SELECT s.artist_id, 1 as numarator, 1 as numitor FROM FavouriteSongs fs, Sings s"
                    + " WHERE (fs.song_id = s.song_id) AND (user_id=@user_id)) as tmptab"
            + " GROUP BY artist_id");
        mydb.setParameter("user_id", user_id);
        reader = mydb.ExecuteReader();

        while (reader.Read())
        {
            int artistId = Int32.Parse(reader["artist_id"].ToString());
            double avg = Double.Parse(reader["medie"].ToString());
            VoteWeights[artistId] += avg;
        }

        // Adaug ponderea pentru artist favorit
        mydb.newQuery("SELECT artist_id FROM FavouriteArtists WHERE user_id=@user_id");
        mydb.setParameter("user_id", user_id);
        reader = mydb.ExecuteReader();
        while (reader.Read())
        {
            int artistId = Int32.Parse(reader["artist_id"].ToString());
            VoteWeights[artistId] *= 0.25;
            VoteWeights[artistId] += 0.75;
        }

        // Calculez ponderea dupa numarul de ascultari
        int mostPlayed = 0;
        List<KeyValuePair<int, int>> songCount = new List<KeyValuePair<int, int>>();
        
        mydb.newQuery("SELECT tab2.artist_id, tab2.cnt-ISNULL(tab1.cnt, 0) as diff"
            + " FROM (SELECT s.artist_id, COUNT(*) as cnt FROM Vote v, Sings s"
            + " WHERE v.song_id = s.song_id AND v.user_id=@user_id AND v.type <= 1 AND v.song_id IN"
                + " (SELECT song_id FROM NewHistory WHERE user_id=@user_id)"
            + " GROUP BY s.artist_id) as tab1 RIGHT OUTER JOIN "
            + " (SELECT s.artist_id, COUNT(*) as cnt FROM NewHistory nh, Sings s"
            + " WHERE s.song_id = nh.song_id AND nh.user_id=@user_id"
            + " GROUP BY s.artist_id) as tab2 ON tab1.artist_id=tab2.artist_id");
        mydb.setParameter("user_id", user_id);
        reader = mydb.ExecuteReader();
        while (reader.Read())
        {
            int artistId = Int32.Parse(reader["artist_id"].ToString());
            int diff = Int32.Parse(reader["diff"].ToString());
            songCount.Add(new KeyValuePair<int, int>(artistId, diff));
            mostPlayed = Math.Max(mostPlayed, diff);    
        }
        
        for (int i = 0; i < songCount.Count; ++i)
            HistoryWeights[songCount[i].Key] = GetSongCountWeight((double) songCount[i].Value / mostPlayed);

        foreach (KeyValuePair<int, double> entry in VoteWeights)
            TotalWeights[entry.Key] = 0.7 * entry.Value + 0.3 * HistoryWeights[entry.Key];

        mydb.newQuery("UPDATE [User] SET last_artists_weights_update=@last_update WHERE user_id=@user_id");
        mydb.setParameter("last_update", DateTime.Now);
        mydb.setParameter("user_id", user_id);
        mydb.ExecuteNonQuery();
        foreach (KeyValuePair<int, double> entry in TotalWeights)
        {
            mydb.newQuery("INSERT INTO ArtistWeights VALUES (@user_id, @artist_id, @weight)");
            mydb.setParameter("user_id", user_id);
            mydb.setParameter("artist_id", entry.Key);
            mydb.setParameter("weight", entry.Value);
            mydb.ExecuteNonQuery();
        }

        return TotalWeights;
    }

    protected Dictionary<int, double> GetArtistsWeights(int user_id)
    {
        Dictionary<int, double> Weights = new Dictionary<int, double>();
        mydb.newQuery("SELECT artist_id, weight FROM ArtistWeights WHERE user_id=@user_id");
        mydb.setParameter("user_id", user_id);
        SqlDataReader reader = mydb.ExecuteReader();
        
        while (reader.Read()) 
        {
            int artistId = Int32.Parse(reader["artist_id"].ToString());
            double weight = Double.Parse(reader["weight"].ToString());
            Weights[artistId] = weight;
        }
        
        return Weights;
    }

    //---------------------------------------------

    public double conservativeFunction(int x)
    {
        //-arctan((x-14))+1.57
        return -Math.Atan((double)(x - 14)) + 1.57;
    }

    double[] conservativeState(List<KeyValuePair<int, double>> weight)
    {
        int artistsNumber = weight.Count;
        double[] functionValues = new double[artistsNumber];

        for (int i = 0; i < artistsNumber; i++)
            functionValues[i] = conservativeFunction(i);

        calculateDistribution(functionValues);
        return functionValues;
    }

    public double discoveryFunction(int x)
    {
        //1/sqr(2*3.14*200)*e^((-(x-30)^2)/(2*200))
        return 1 / Math.Sqrt(2 * Math.PI * 200) * Math.Exp(-(double)(x - 30) * (x - 30) / (2 * 200));
    }

    double[] discoveryState(List<KeyValuePair<int, double>> weight)
    {
        int artistsNumber = weight.Count;
        double[] functionValues = new double[artistsNumber];
        
        for (int i = 0; i < artistsNumber; i++)
            functionValues[i] = discoveryFunction(i);

        calculateDistribution(functionValues);
        return functionValues;
    }

    public double normalFunction(int x)
    {
        //-arctan((x-17)/4)+1.57
        return -Math.Atan((double)(x - 17) / 4) + 1.57;
    }

    double[] normalState(List<KeyValuePair<int, double>> weight)
    {
        int artistsNumber = weight.Count;
        double[] functionValues = new double[artistsNumber];

        for (int i = 0; i < artistsNumber; i++)
            functionValues[i] = normalFunction(i);

        calculateDistribution(functionValues);
        return functionValues;
    }

    double[] normalSongState(List<int> song, List<int> favouriteSong,
        List<KeyValuePair<int, int>> votedSong)
    {
        double[] songValue = new double[song.Count];
        for (int i = 0; i < song.Count; i++)
        {
            int position = favouriteSong.BinarySearch(song[i]);
            if (position >= 0)
                songValue[i] = 1;
            else
            {
                position = -1;
                for (int j = 0; j < votedSong.Count; j++)
                {
                    if (votedSong[j].Key == song[i])
                    {
                        position = j;
                        break;
                    }
                }
                if (position >= 0)
                {
                    int type = votedSong[position].Value;
                    switch (type)
                    {
                        case 0:
                            songValue[i] = 0.0001;
                            break;
                        case 1:
                            songValue[i] = 0.10;
                            break;
                        case 2:
                            songValue[i] = 0.55;
                            break;
                        case 3:
                            songValue[i] = 0.75;
                            break;
                        case 4:
                            songValue[i] = 0.90;
                            break;
                    }
                }
                else
                {
                    songValue[i] = 0.5;
                }
            }
        }

        calculateDistribution(songValue);
        return songValue;
    }

    double[] conservativeSongState(List<int> song, List<int> favouriteSong,
        List<KeyValuePair<int, int>> votedSong, List<int> listenedSong)
    {
        double[] songValues = new double[song.Count];
        for (int i = 0; i < song.Count; i++)
        {
            int position = -1;
            position = favouriteSong.BinarySearch(song[i]);
            if (position >= 0)
            {
                songValues[i] = 1;
            }
            else
            {
                position = -1;
                for (int j = 0; j < votedSong.Count; j++)
                {
                    if (votedSong[j].Key == song[i])
                    {
                        position = j;
                        break;
                    }
                }
                if (position >= 0)
                {
                    int type = votedSong[position].Value;
                    switch (type)
                    {
                        case 0:
                            songValues[i] = 0.0001;
                            break;
                        case 1:
                            songValues[i] = 0.10;
                            break;
                        case 2:
                            songValues[i] = 0.55;
                            break;
                        case 3:
                            songValues[i] = 0.75;
                            break;
                        case 4:
                            songValues[i] = 0.90;
                            break;
                    }
                }
                else
                {
                    position = listenedSong.BinarySearch(song[i]);
                    if (position >= 0)
                        songValues[i] = 0.5;
                    else
                        songValues[i] = 0.3;
                }
            }
        }
        
        calculateDistribution(songValues);
        return songValues;
    }

    double[] discoverySongState(List<int> song, List<int> favouriteSong,
        List<KeyValuePair<int, int>> votedSong, List<int> listenedSong)
    {
        double[] songValues = new double[song.Count];
        for (int i = 0; i < song.Count; i++)
        {
            int position = -1;
            position = favouriteSong.BinarySearch(song[i]);
            if (position >= 0)
                songValues[i] = 0.2;
            else
            {
                position = -1;
                for (int j = 0; j < votedSong.Count; j++)
                {
                    if (votedSong[j].Key == song[i])
                    {
                        position = j;
                        break;
                    }
                }
                if (position >= 0)
                {
                    int type = votedSong[position].Value;
                    switch (type)
                    {
                        case 0:
                            songValues[i] = 0.0001;
                            break;
                        case 1:
                            songValues[i] = 0.02;
                            break;
                        case 2:
                            songValues[i] = 0.1;
                            break;
                        case 3:
                            songValues[i] = 0.15;
                            break;
                        case 4:
                            songValues[i] = 0.20;
                            break;
                    }
                }
                else
                {
                    position = listenedSong.BinarySearch(song[i]);
                    if (position < 0)
                        songValues[i] = 1;
                    else
                        songValues[i] = 0.25;
                }
            }
        }

        calculateDistribution(songValues);
        return songValues;
    }

    public void calculateDistribution(double[] Values)
    {
        double sum = Values[0];
        int length = Values.Length;
        for (int i = 1; i < length; i++)
        {
            sum += Values[i];
            Values[i] += Values[i - 1];
        }
        for (int i = 0; i < length; i++)
            Values[i] /= sum;
    }

    public int suggestArtists(double[] functionValues, List<KeyValuePair<int, double>> weight)
    {
        int artistsNumber = weight.Count;
        int artistId = 0, artistPosition = 0;
        //Random random = new Random();

        double x = random.NextDouble();
        int i = 0;
        while (i < artistsNumber && x > functionValues[i])
        {
            i++;
        }
        artistPosition = i;
        artistId = weight[artistPosition].Key;
        return artistId;
    }
    
    int suggestSong(List<int> song, double[] songValues)
    {
        int length = song.Count;
        //Random random = new Random();
        double x = random.NextDouble();
        
        int j = 0;
        while (j < length && x > songValues[j])
        {
            j++;
        }
        int songPosition = j;
        return song[songPosition];
    }

    protected string GetArtistName(int artist_id)
    {
        mydb.newQuery("SELECT artist_name FROM Artist WHERE artist_id = @artist_id");
        mydb.setParameter("artist_id", artist_id);
        SqlDataReader reader = mydb.ExecuteReader();
        if (reader.Read())
            return reader["artist_name"].ToString();
        return "";
    }

    protected SongInfo GetSongInfo(int songId, int userId)
    {
        mydb.newQuery("SELECT song_name, artists, album, album_id, year, genres, duration,"
            + " ISNULL((SELECT type FROM Vote WHERE song_id=@song_id and user_id=@user_id), -1) as vote"
            + " FROM Song WHERE song_id=@song_id");
        mydb.setParameter("song_id", songId);
        mydb.setParameter("user_id", userId);
        SqlDataReader reader = mydb.ExecuteReader();
        reader.Read();
        string songName = reader["song_name"].ToString();
        string artists = reader["artists"].ToString();
        string album = reader["album"].ToString();
        int albumId = int.Parse(reader["album_id"].ToString());
        int year = int.Parse(reader["year"].ToString());
        string genres = reader["genres"].ToString();
        string duration = reader["duration"].ToString();
        int vote = int.Parse(reader["vote"].ToString());
        return new SongInfo(songId, songName, artists, album, year, genres, duration, vote, albumId);
    }

    protected SongInfo GetProfileSuggestion(int userId, string suggestionMode)
    {
        mydb.newQuery("SELECT last_artists_weights_update FROM [User] WHERE user_id=@user_id");
        mydb.setParameter("user_id", userId);
        SqlDataReader reader = mydb.ExecuteReader();
        reader.Read();
        DateTime lastUpdate = DateTime.Parse(reader["last_artists_weights_update"].ToString());

        Dictionary<int, double> Weights;
        //if (DateTime.Now - lastUpdate > TimeSpan.FromHours(1))
            Weights = UpdateArtistsWeights(userId);
        //else
        //    Weights = GetArtistsWeights(userId);

        Dictionary<int, double> Scores = new Dictionary<int, double>();
        mydb.newQuery("Select artist_id from Artist;");
        reader = mydb.ExecuteReader();

        while (reader.Read())
        {
            int artist_id = Int32.Parse(reader["artist_id"].ToString());
            Scores.Add(artist_id, 0);
        }

        foreach (KeyValuePair<int, double> entry in Weights)
        {
            mydb.newQuery("SELECT artist2_id, similarity FROM ArtistSimilarity WHERE artist1_id=@artist_id");
            mydb.setParameter("artist_id", entry.Key);
            reader = mydb.ExecuteReader();
            while (reader.Read())
            {
                int artist_id = Int32.Parse(reader["artist2_id"].ToString());
                double similarity = Double.Parse(reader["similarity"].ToString());
                Scores[artist_id] += entry.Value * similarity;
            }
        }

        List<KeyValuePair<int, double>> ScoresList = new List<KeyValuePair<int, double>>();
        foreach (KeyValuePair<int, double> entry in Scores)
            ScoresList.Add(entry);
        ScoresList.Sort(Comparer);

        double[] functionValues;
        if (suggestionMode == "normal")
            functionValues = normalState(ScoresList);
        else if (suggestionMode == "conservative")
            functionValues = conservativeState(ScoresList);
        else
            functionValues = discoveryState(ScoresList);

        List<int> song;
        int artistId;
        
        do
        {
            artistId = suggestArtists(functionValues, ScoresList);

            // Se obtine o lista cu toate melodiile cantate de artistul curent.
            mydb.newQuery("Select s1.song_id from Song s1, Sings s2 where s2.artist_id = @id AND s1.song_id = s2.song_id");
            mydb.setParameter("id", artistId);
            reader = mydb.ExecuteReader();

            song = new List<int>();
            while (reader.Read())
                song.Add(Int32.Parse(reader["song_id"].ToString()));
        }
        while (song.Count == 0);

        // Se obtin o lista sortata (dupa id) a melodiilor favorite ale utilizatorului curent 
        // cantate de artistul selectat.
        mydb.newQuery("Select s.song_id from FavouriteSongs f, Sings s where " +
            "s.song_id = f.song_id and s.artist_id = @artistId and f.user_id = @userId");
        mydb.setParameter("userId", userId);
        mydb.setParameter("artistId", artistId);
        reader = mydb.ExecuteReader();

        List<int> favouriteSong = new List<int>();
        while (reader.Read())
        {
            favouriteSong.Add(Int32.Parse(reader["song_id"].ToString()));
        }
        favouriteSong.Sort();

        // Se obtine o lista a melodiilor artistului selectat, votate de utilizatorul curent.
        mydb.newQuery("Select s.song_id, v.type from Vote v, Sings s where " +
            "s.song_id = v.song_id and s.artist_id = @artistId and v.user_id = @userId");
        mydb.setParameter("userId", userId);
        mydb.setParameter("artistId", artistId);
        reader = mydb.ExecuteReader();

        List<KeyValuePair<int, int>> votedSong = new List<KeyValuePair<int, int>>();
        while (reader.Read())
        {
            int id = Int32.Parse(reader["song_id"].ToString());
            int vote = Int32.Parse(reader["type"].ToString());
            votedSong.Add(new KeyValuePair<int, int>(id, vote));
        }

        // Se obtine o lista sortata (dupa id) a melodiilor artistului selectat, 
        // ascultate pana acum de utilizatorul curent.
        mydb.newQuery("Select s.song_id from NewHistory h, Sings s where " +
            "s.song_id = h.song_id and s.artist_id = @artistId and h.user_id = @userId");
        mydb.setParameter("userId", userId);
        mydb.setParameter("artistId", artistId);
        reader = mydb.ExecuteReader();

        List<int> listenedSong = new List<int>();
        while (reader.Read())
        {
            int id = Int32.Parse(reader["song_id"].ToString());
            listenedSong.Add(id);
        }
        listenedSong.Sort();

        // Se sugereaza o melodie utilizatorului curent.
        double[] songValues;
        if (suggestionMode == "normal")
            songValues = normalSongState(song, favouriteSong, votedSong);
        else if (suggestionMode == "conservative")
            songValues = conservativeSongState(song, favouriteSong, votedSong, listenedSong);
        else
            songValues = discoverySongState(song, favouriteSong, votedSong, listenedSong);

        int songId = suggestSong(song, songValues);
        SongInfo songInfo = GetSongInfo(songId, userId);
        return songInfo;
    }

    protected SongInfo GetFriendsLibrarySuggestion(int userId)
    {
        mydb.newQuery("SELECT TOP 1 tab1.song_id, song_name, artists, album, album_id, year,"
            + " genres, duration, ISNULL(type, -1) as vote FROM"
            + " (SELECT s.song_id, song_name, artists, album, album_id, year, genres, duration"
            + " FROM Song s, [Contains] c, Playlist p, Friends f"
            + " WHERE s.song_id = c.song_id AND c.playlist_id = p.playlist_id"
            + " AND f.user2_id = p.owner_id AND f.user1_id=@user_id) as tab1 LEFT OUTER JOIN"
            + " (SELECT song_id, type FROM Vote WHERE user_id=@user_id) as tab2 ON tab1.song_id = tab2.song_id"
            + " ORDER BY NEWID()");
        mydb.setParameter("user_id", userId);
        SqlDataReader reader = mydb.ExecuteReader();
        if (reader.Read())
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
            return new SongInfo(songId, songName, artists, album, year, genres, duration, vote, albumId);
        }
        return null;
    }

    protected SongInfo GetTopSuggestion(int userId)
    {
        mydb.newQuery("SELECT TOP (1) song_id, song_name, artists, album_id, album, year, genres, duration, listen, Vot " +
            "FROM (SELECT TOP (100) a.song_id, a.song_name, a.artists, a.album_id, a.album, a.year, a.genres, a.duration, " +
            "a.listen, ISNULL(b.type, - 1) AS Vot FROM " +
            "(SELECT s.song_id, s.song_name, s.artists, s.album_id, s.album, s.year, s.genres, s.duration, h.listen " +
            "FROM Song AS s INNER JOIN (SELECT song_id, COUNT(song_id) AS listen FROM NewHistory " +
            "WHERE (listen_date > DATEADD(day, -90, GETDATE())) " +
            "GROUP BY song_id) AS h ON s.song_id = h.song_id) AS a LEFT OUTER JOIN " +
                "(SELECT song_id, type " +
                    "FROM Vote WHERE (user_id = @userId)) AS b ON a.song_id = b.song_id " +
                          "ORDER BY a.listen DESC) AS derivedtbl_1 ORDER BY NEWID();");
        
        mydb.setParameter("userId", userId);
        SqlDataReader reader = mydb.ExecuteReader();
        
        SongInfo suggestedSong = null;       
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
            suggestedSong = new SongInfo(songId, songName, artists, album, year, genres, duration, voteType, albumId);
        }

        return suggestedSong;
    }

    protected override void Respond(HttpContext context)
    {        
        int userId = Int32.Parse(context.Request.Params["user_id"]);
        string suggestionMode = context.Request.Params["suggestion_mode"];
        int results = Int32.Parse(context.Request.Params["results"]);
        string[] lastQueued = context.Request.Params.GetValues("lastQueued[]");
        
        List<int> recentSongs = new List<int>();
        if (lastQueued != null)
            for (int i = 0; i < lastQueued.Length; ++i)
                recentSongs.Add(int.Parse(lastQueued[i]));
        
        List<SongInfo> suggestResults = new List<SongInfo>();
        for (int i = 0; i < results; ++i)
        {
            SongInfo suggestion;
            int trials = 0;
            do
            {
                ++trials;
                if (suggestionMode == "normal" || suggestionMode == "conservative" || suggestionMode == "discovery")
                    suggestion = GetProfileSuggestion(userId, suggestionMode);
                else if (suggestionMode == "friends")
                    suggestion = GetFriendsLibrarySuggestion(userId);
                else 
                    suggestion = GetTopSuggestion(userId);           
            }
            while ((suggestion == null || recentSongs.Contains(suggestion.SongId)) && trials <= MAX_TRIALS);

            if (suggestion != null)
            {
                recentSongs.Add(suggestion.SongId);
                suggestResults.Add(suggestion);
            }
        }

        context.Response.Write(JsonConvert.SerializeObject(suggestResults));
	}
}