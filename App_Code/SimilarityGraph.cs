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

/// <summary>
/// Summary description for SimilarityGraph
/// </summary>
/// 

public class SimilarityGraph
{
    public const double EPS = 0.0001;
    public const double MAX_STEPS = 4;

    public static void GetEchonestData(Dictionary<String, int> similarArtists, string artist)
    {
        try
        {
            string filename = HttpContext.Current.Server.MapPath("~")
                + "/suggest-xml/echonest/" + HttpUtility.UrlEncode(artist) + ".xml";

            if (!File.Exists(filename))
            {
                string url = "http://developer.echonest.com/api/v4/artist/similar?api_key=N6E4NIOVYMTHNDM8J&name="
                + HttpUtility.UrlEncode(artist) + "&format=xml&results=100&start=0";
                WebRequest getObj = WebRequest.Create(url);
                Stream objStream = getObj.GetResponse().GetResponseStream();
                StreamReader objReader = new StreamReader(objStream);

                TextWriter tw = new StreamWriter(filename);

                string line = objReader.ReadLine();
                while (line != null)
                {
                    tw.WriteLine(line);
                    line = objReader.ReadLine();
                }

                tw.Close();
            }

            XmlDocument xmldoc = new XmlDocument();
            xmldoc.Load(filename);
            XmlElement root = xmldoc.DocumentElement;
            XmlNodeList suggestedArtists = root.SelectNodes("//artist");

            for (int i = 0; i < suggestedArtists.Count; ++i)
            {
                string similarArtist = suggestedArtists[i].SelectSingleNode("name").InnerText;

                if (!similarArtists.ContainsKey(similarArtist))
                    similarArtists.Add(similarArtist, 0);
                ++similarArtists[similarArtist];
            }
        }
        catch (Exception ex)
        {
        }
    }

    public static void GetLastFMData(Dictionary<String, int> similarArtists, string artist)
    {
        try
        {
            string filename = HttpContext.Current.Server.MapPath("~")
                + "/suggest-xml/last-fm/" + HttpUtility.UrlEncode(artist) + ".xml";

            if (!File.Exists(filename))
            {
                string url = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist="
                    + HttpUtility.UrlEncode(artist) + "&api_key=b25b959554ed76058ac220b7b2e0a026";

                WebRequest getObj = WebRequest.Create(url);
                Stream objStream = getObj.GetResponse().GetResponseStream();
                StreamReader objReader = new StreamReader(objStream);

                TextWriter tw = new StreamWriter(filename);

                string line = objReader.ReadLine();
                while (line != null)
                {
                    tw.WriteLine(line);
                    line = objReader.ReadLine();
                }

                tw.Close();
            }

            XmlDocument xmldoc = new XmlDocument();
            xmldoc.Load(filename);
            XmlElement root = xmldoc.DocumentElement;
            XmlNodeList suggestedArtists = root.SelectNodes("//artist");

            for (int i = 0; i < suggestedArtists.Count; ++i)
            {
                string similarArtist = suggestedArtists[i].SelectSingleNode("name").InnerText;

                if (!similarArtists.ContainsKey(similarArtist))
                    similarArtists.Add(similarArtist, 0);
                ++similarArtists[similarArtist];
            }
        }
        catch (Exception ex)
        {
        }
    }

    public static void GetYahooData(Dictionary<String, int> similarArtists, string artist)
    {
        try
        {
            string filename = HttpContext.Current.Server.MapPath("~")
                + "/suggest-xml/yahoo/" + HttpUtility.UrlEncode(artist) + ".xml";

            if (!File.Exists(filename))
            {
                string url = "http://query.yahooapis.com/v1/public/yql?q=select%20name%20from%20music.artist.similar"
                    + "%20where%20id%20in%20%28select%20id%20from%20music.artist.search%20where%20keyword%3D%22"
                    + artist + "%22%29";

                WebRequest getObj = WebRequest.Create(url);
                Stream objStream = getObj.GetResponse().GetResponseStream();
                StreamReader objReader = new StreamReader(objStream);

                TextWriter tw = new StreamWriter(filename);

                string line = objReader.ReadLine();
                while (line != null)
                {
                    tw.WriteLine(line);
                    line = objReader.ReadLine();
                }

                tw.Close();
            }

            XmlDocument xmldoc = new XmlDocument();
            xmldoc.Load(filename);
            XmlElement root = xmldoc.DocumentElement;
            XmlNodeList suggestedArtists = root.SelectNodes("//Artist");

            for (int i = 0; i < suggestedArtists.Count; ++i)
            {
                string similarArtist = suggestedArtists[i].Attributes["name"].InnerText;

                if (!similarArtists.ContainsKey(similarArtist))
                    similarArtists.Add(similarArtist, 0);
                ++similarArtists[similarArtist];
            }
        }
        catch (Exception ex)
        {
        }
    }

    public static List<ArtistInfo> GetArtists(MyDatabase mydb, int ArtistId)
    {
        List<ArtistInfo> artists = new List<ArtistInfo>();

        mydb.newQuery("SELECT artist_id, artist_name from Artist WHERE artist_id != @artist_id");
        mydb.setParameter("artist_id", ArtistId);
        SqlDataReader reader = mydb.ExecuteReader();

        while (reader.Read())
        {
            int artistId = Int32.Parse(reader["artist_id"].ToString());
            string artistName = reader["artist_name"].ToString();

            artists.Add(new ArtistInfo(artistId, artistName));
        }

        return artists;
    }

    public static double initialSimilarity(int noMatches)
    {
        switch (noMatches)
        {
            case 1:
                return 0.4;
            case 2:
                return 0.75;
            case 3:
                return 0.9;
        }

        return 0;
    }

    public static double transitiveSimilarity(double similarity, double numerator, double denominator)
    {
        double ratio = 0;

        if (numerator == 0)
            ratio = 0;
        else
            ratio = numerator / denominator;

        if (Math.Abs(similarity) < EPS)
            return ratio * (0.60 - 0.00);
        if (Math.Abs(similarity - 0.40) < EPS)
            return ratio * (0.8 - 0.40);
        if (Math.Abs(similarity - 0.75) < EPS)
            return ratio * (0.95 - 0.75);
        if (Math.Abs(similarity - 0.90) < EPS)
            return ratio * (0.99 - 0.90);

        return 0;
    }

    public static void StoreSimilarity(MyDatabase mydb, int artist1_id, int artist2_id, double similarity)
    {
        mydb.newQuery("INSERT INTO ArtistSimilarity VALUES(@artist1_id, @artist2_id, @similarity)");
        mydb.setParameter("artist1_id", artist1_id);
        mydb.setParameter("artist2_id", artist2_id);
        mydb.setParameter("similarity", similarity);
        mydb.ExecuteNonQuery();
    }

    public static Dictionary<int, double> CalculateSimilarities(MyDatabase mydb, ArtistInfo Artist, 
        bool batchMode = false, List<ArtistInfo> prevArtists = null)
    {
        if (!batchMode)
        {
            mydb.newQuery("DELETE FROM ArtistSimilarity WHERE artist1_id=@artist_id OR artist2_id=@artist_id");
            mydb.setParameter("artist_id", Artist.ArtistId);
            mydb.ExecuteNonQuery();
        }

        Dictionary<String, int> similarArtists = new Dictionary<string, int>();

        GetEchonestData(similarArtists, Artist.ArtistName);
        GetLastFMData(similarArtists, Artist.ArtistName);
        GetYahooData(similarArtists, Artist.ArtistName);

        if (!batchMode)
            prevArtists = GetArtists(mydb, Artist.ArtistId);

        Dictionary<int, double> similarityNumerator = new Dictionary<int, double>();
        Dictionary<int, double> similarityDenominator = new Dictionary<int, double>();
        Dictionary<int, double> similarity = new Dictionary<int, double>();
        for (int i = 0; i < prevArtists.Count; ++i)
        {
            similarityNumerator.Add(prevArtists[i].ArtistId, 0);
            similarityDenominator.Add(prevArtists[i].ArtistId, 0);

            if (!similarArtists.ContainsKey(prevArtists[i].ArtistName))
                similarity.Add(prevArtists[i].ArtistId, 0);
            else
                similarity.Add(prevArtists[i].ArtistId,
                    initialSimilarity(similarArtists[prevArtists[i].ArtistName]));
        }

        foreach (KeyValuePair<string, int> entry in similarArtists)
        {
            double weight = initialSimilarity(entry.Value);
            weight *= weight;

            mydb.newQuery("SELECT s.artist2_id, s.similarity FROM Artist a, ArtistSimilarity s" +
                " WHERE s.artist1_id = a.artist_id AND a.artist_name=@artist_name AND s.artist2_id!=@artist_id");
            mydb.setParameter("artist_name", entry.Key);
            mydb.setParameter("artist_id", Artist.ArtistId);
            SqlDataReader reader = mydb.ExecuteReader();

            while (reader.Read())
            {
                int artistId = Int32.Parse(reader["artist2_id"].ToString());
                double sim = Double.Parse(reader["similarity"].ToString());

                similarityNumerator[artistId] += sim * weight;
                similarityDenominator[artistId] += weight;
            }
        }

        for (int i = 0; i < prevArtists.Count; ++i)
        {
            int id = prevArtists[i].ArtistId;
            similarity[id] += transitiveSimilarity(similarity[id], similarityNumerator[id], similarityDenominator[id]);
        }

        for (int i = 0; i < prevArtists.Count; ++i)
        {
            StoreSimilarity(mydb, Artist.ArtistId, prevArtists[i].ArtistId, similarity[prevArtists[i].ArtistId]);
            StoreSimilarity(mydb, prevArtists[i].ArtistId, Artist.ArtistId, similarity[prevArtists[i].ArtistId]);
        }
        StoreSimilarity(mydb, Artist.ArtistId, Artist.ArtistId, 1);

        return similarity;
    }

    public static List<ArtistInfo> Shuffle(List<ArtistInfo> list)
    {
        List<ArtistInfo> shuffledList = new List<ArtistInfo>();
        List<int> indexes = new List<int>();
        Random r = new Random();

        for (int i = 0; i < list.Count; ++i)
            indexes.Add(i);

        for (int i = 0; i < list.Count; ++i)
        {
            int pos = (int)(r.NextDouble() * indexes.Count);
            shuffledList.Add(list[indexes[pos]]);
            indexes.RemoveAt(pos);
        }

        return shuffledList;
    }

    public static void CalculateAllSimilarities(MyDatabase mydb)
    {
        List<ArtistInfo> artists = GetArtists(mydb, -1);
        mydb.newQuery("DELETE FROM ArtistSimilarity");
        mydb.ExecuteNonQuery();

        Dictionary<KeyValuePair<int, int>, double> totalSimilarity = new Dictionary<KeyValuePair<int, int>, double>();
        for (int j = 0; j < MAX_STEPS; ++j)
        {
            List<ArtistInfo> prevArtists = new List<ArtistInfo>();
            for (int i = 0; i < artists.Count; ++i)
            {
                System.Diagnostics.Debug.WriteLine(artists[i].ArtistId + " " + artists[i].ArtistName);
                Dictionary<int, double> currentSimilarity = CalculateSimilarities(mydb, artists[i], true, prevArtists);

                foreach (KeyValuePair<int, double> entry in currentSimilarity)
                {
                    KeyValuePair<int, int> pair = new KeyValuePair<int, int>(entry.Key, artists[i].ArtistId);
                    if (!totalSimilarity.ContainsKey(pair))
                        totalSimilarity.Add(pair, 0);
                    totalSimilarity[pair] += entry.Value;

                    pair = new KeyValuePair<int, int>(artists[i].ArtistId, entry.Key);
                    if (!totalSimilarity.ContainsKey(pair))
                        totalSimilarity.Add(pair, 0);
                    totalSimilarity[pair] += entry.Value;
                }
                prevArtists.Add(artists[i]);
            }

            artists = Shuffle(artists);
            mydb.newQuery("DELETE FROM ArtistSimilarity");
            mydb.ExecuteNonQuery();
        }

        foreach (KeyValuePair<KeyValuePair<int, int>, double> entry in totalSimilarity)
            StoreSimilarity(mydb, entry.Key.Key, entry.Key.Value, entry.Value / MAX_STEPS);

        for (int i = 0; i < artists.Count; ++i)
            StoreSimilarity(mydb, artists[i].ArtistId, artists[i].ArtistId, 1);
    }
}