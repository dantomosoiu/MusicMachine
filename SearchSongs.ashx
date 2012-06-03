<%@ WebHandler Language="C#" Class="SearchSongs" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public class SearchSongs : ServerResponse
{
    MyDatabase mydb = new MyDatabase();

    // Imparte textul in cuvinte.
    protected String[] GetWords(String text)
    {
        List<char> separators = new List<char>();
        for (int i = 0; i < text.Length; ++i)
            if (char.IsSeparator(text[i]))
                separators.Add(text[i]);
        separators.Add(',');
        return text.Split(separators.ToArray(), StringSplitOptions.RemoveEmptyEntries);        
    }

    // Obtine pentru fiecare parametru valorile dupa care se realizeaza filtrarea query-ului in baza de date.
    protected String[][] GetFilterValues(HttpContext context, String[] paramNames)
    {
        String[][] filterValues = new String[paramNames.Length][];
        for (int i = 0; i < paramNames.Length; ++i)
        {
            String searchString = context.Request.Params[paramNames[i]];
            filterValues[i] = GetWords(searchString);
        }

        return filterValues;
    }

    // Completeaza subcererea SQL cu valorile de filtrare. Insereaza subcererea SQL in cererea SQL principala. 
    protected void SetSearchQuery(String[] dbFilters, String[][] filterValues, int userId)
    {
        string sqlQuery = "SELECT tab2.song_id, song_name, artists, album, album_id,"
            + " genres, year, duration, ISNULL(type, -1) as vote FROM"
            + " (SELECT song_id, type FROM Vote Where user_id=@user_id) tab1 RIGHT OUTER JOIN"
            + " (%subquery) as tab2 ON tab1.song_id = tab2.song_id";
        string sqlSubQuery = "SELECT song_id, song_name, artists, album, year, genres, duration, album_id FROM [Song]";
        
        List<string> Parameters = new List<string>();

        for (int i = 0; i < dbFilters.Length; ++i)
            for (int j = 0; j < filterValues[i].Length; ++j)
                if (filterValues[i][j].Length > 1)
                {
                    if (Parameters.Count == 0)
                        sqlSubQuery += " WHERE";
                    else
                        sqlSubQuery += " OR";
                    
                    sqlSubQuery += " UPPER(" + dbFilters[i] + ") LIKE UPPER(@param" +  Parameters.Count + ")";
                    Parameters.Add("%" + filterValues[i][j] + "%");
                }
        sqlQuery = sqlQuery.Replace("%subquery", sqlSubQuery);
        
        mydb.newQuery(sqlQuery);
        for (int i = 0; i < Parameters.Count; ++i)
            mydb.setParameter("param" + i, Parameters[i]);
        mydb.setParameter("user_id", userId);
    }

    // Numara potrivirile unui set de cuvinte pe un text.
    protected int CountMatches(String text, String[] words)
    {
        int noMatches = 0;

        for (int i = 0; i < words.Length; ++i)
            if (words[i].Length > 1)
                noMatches += Regex.Matches(text.ToLower(), words[i].ToLower()).Count;

        return noMatches;
    }

    // Functie de comparare pentru ordonarea rezultatelor dupa relevanta 
    // (in functie de numarul de potriviri al cuvintelor introduse).
    public static int CompareResults(KeyValuePair<SongInfo, int> entry1, KeyValuePair<SongInfo, int> entry2)
    {
        return entry2.Value - entry1.Value;
    }

    protected override void Respond(HttpContext context)
    {
        int userId = int.Parse(context.Request.Params["user_id"]);
        int results = int.Parse(context.Request.Params["results"]);
        String[] dbFilters = { "song_name", "artists", "album", "year", "genres" };
        String[] paramNames = {"songName", "artists", "album", "year", "genres"};
        List<KeyValuePair<SongInfo, int>> searchResults = new List<KeyValuePair<SongInfo, int>>();
        
        String[][] filterValues = GetFilterValues(context, paramNames);
        for (int i = 0; i < filterValues[4].Length; ++i)
            System.Diagnostics.Debug.WriteLine(filterValues[4][i]);

        SetSearchQuery(dbFilters, filterValues, userId);
        SqlDataReader reader = mydb.ExecuteReader();
        
        while (reader.Read())
        {
            int noMatches = 0;
            
            int songId = Int32.Parse(reader["song_id"].ToString());
            String songName = reader["song_name"].ToString();
            String artists = reader["artists"].ToString();
            String album = reader["album"].ToString();
            int year = Int32.Parse(reader["year"].ToString());
            String genres = reader["genres"].ToString();
            String duration = reader["duration"].ToString();
            int albumId = Int32.Parse(reader["album_id"].ToString());
            int vote = Int32.Parse(reader["vote"].ToString());

            noMatches += CountMatches(songName, filterValues[0]);
            noMatches += CountMatches(artists, filterValues[1]);
            noMatches += CountMatches(album, filterValues[2]);
            noMatches += CountMatches(year.ToString(), filterValues[3]);
            noMatches += CountMatches(genres, filterValues[4]);

            if (noMatches > 0)
                searchResults.Add(new KeyValuePair<SongInfo, int>
                    (new SongInfo(songId, songName, artists, album, year, genres, duration, vote, albumId), noMatches));
        }

        searchResults.Sort(CompareResults);
        List<SongInfo> sortedResults = new List<SongInfo>();
        for (int i = 0; i < searchResults.Count; ++i)
            sortedResults.Add(searchResults[i].Key);

        if (sortedResults.Count > results)
            sortedResults = sortedResults.GetRange(0, results);
        context.Response.Write(JsonConvert.SerializeObject(sortedResults));
    }
}