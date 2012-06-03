<%@ WebHandler Language="C#" Class="SearchUsers" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public class SearchUsers : ServerResponse
{
    MyDatabase mydb = new MyDatabase();

    // Imparte textul in cuvinte.
    protected String[] getWords(String text)
    {
        List<char> separators = new List<char>();
        for (int i = 0; i < text.Length; ++i)
            if (char.IsSeparator(text[i]))
                separators.Add(text[i]);
        separators.Add(',');
        return text.Split(separators.ToArray(), StringSplitOptions.RemoveEmptyEntries);
    }

    // Obtine pentru fiecare parametru valorile dupa care se realizeaza filtrarea query-ului in baza de date.
    protected String[][] getFilterValues(HttpContext context, String[] paramNames)
    {
        String[][] filterValues = new String[paramNames.Length][];
        for (int i = 0; i < paramNames.Length; ++i)
        {
            String searchString = context.Request.Params[paramNames[i]];
            filterValues[i] = getWords(searchString);
        }

        return filterValues;
    }

    // Completeaza subcererea SQL cu valorile de filtrare. Insereaza subcererea SQL in cererea SQL principala. 
    protected void SetSearchQuery(String[] dbFilters, String[][] filterValues)
    {
        string sqlQuery = "SELECT user_id, first_name, last_name, email FROM [User]";
        List<string> Parameters = new List<string>();

        for (int i = 0; i < dbFilters.Length; ++i)
            for (int j = 0; j < filterValues[i].Length; ++j)
                if (filterValues[i][j].Length > 1)
                {
                    if (Parameters.Count == 0)
                        sqlQuery += " WHERE";
                    else
                        sqlQuery += " OR";

                    sqlQuery += " UPPER(" + dbFilters[i] + ") LIKE UPPER(@param" + Parameters.Count + ")";
                    Parameters.Add("%" + filterValues[i][j] + "%");
                }
        
        mydb.newQuery(sqlQuery);
        for (int i = 0; i < Parameters.Count; ++i)
            mydb.setParameter("param" + i, Parameters[i]);
    }

    // Adauga valorile de filtrare la query-ul SQL.
    protected String addFilters(String sqlQuery, String[] dbFilters, String[][] filterValues)
    {
        bool isFirst = true;
        for (int i = 0; i < dbFilters.Length; ++i)
            for (int j = 0; j < filterValues[i].Length; ++j)
                if (filterValues[i][j].Length > 1)
                {
                    if (isFirst)
                    {
                        sqlQuery += " WHERE";
                        isFirst = false;
                    }
                    else
                        sqlQuery += " OR";
                    sqlQuery += " UPPER(" + dbFilters[i] + ") LIKE UPPER('%" + filterValues[i][j] + "%')";
                }
        
        return sqlQuery;
    }

    // Numara potrivirile unui set de cuvinte pe un text.
    protected int countMatches(String text, String[] words)
    {
        int noMatches = 0;

        for (int i = 0; i < words.Length; ++i)
            if (words[i].Length > 1)
                noMatches += Regex.Matches(text.ToLower(), words[i].ToLower()).Count;

        return noMatches;
    }

    // Functie de comparare pentru ordonarea rezultatelor dupa relevanta 
    // (in functie de numarul de potriviri al cuvintelor introduse).
    public static int CompareResults(KeyValuePair<BasicInfo, int> entry1, KeyValuePair<BasicInfo, int> entry2)
    {
        return entry2.Value - entry1.Value;
    }    

    protected override void Respond(HttpContext context)
    {
        int results = int.Parse(context.Request.Params["results"]);
        String[] dbFilters = { "first_name", "last_name", "email" };
        String[] paramNames = { "firstName", "lastName", "email" };
        List<KeyValuePair<BasicInfo, int>> searchResults = new List<KeyValuePair<BasicInfo, int>>();

        String[][] filterValues = getFilterValues(context, paramNames);

        SetSearchQuery(dbFilters, filterValues);
        SqlDataReader reader = mydb.ExecuteReader();

        while (reader.Read())
        {
            int noMatches = 0;
            int userId = Int32.Parse(reader["user_id"].ToString());
            String firstName = reader["first_name"].ToString();
            String lastName = reader["last_name"].ToString();
            String email = reader["email"].ToString();
            
            noMatches += countMatches(firstName, filterValues[0]);
            noMatches += countMatches(lastName, filterValues[1]);
            noMatches += countMatches(email, filterValues[2]);

            if (noMatches > 0)
                searchResults.Add(new KeyValuePair<BasicInfo, int>
                    (new BasicInfo(userId, firstName, lastName, email), noMatches));
        }

        searchResults.Sort(CompareResults);
        List<BasicInfo> sortedResults = new List<BasicInfo>();
        for (int i = 0; i < searchResults.Count; ++i)
            sortedResults.Add(searchResults[i].Key);
        
        if (sortedResults.Count > results)
            sortedResults = sortedResults.GetRange(0, results);
        context.Response.Write(JsonConvert.SerializeObject(sortedResults));
    }
}