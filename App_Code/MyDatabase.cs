using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Runtime.Serialization;

/// <summary>
/// Pune la dispozitie metode de lucru mai facil cu baza de date
/// </summary>
public class MyDatabase
{
    String sqlQuery;
    //SqlConnection sqlConnection;
    //SqlCommand sqlCommand;
    //SqlDataReader sqlReader;

	public MyDatabase()
	{
        //HttpContext.Current.Session["mydbobj_connectionActive"] = true;
	}
    ~MyDatabase()
    {
        if (HttpContext.Current != null)
        {
            if (HttpContext.Current.Session["mydbobj_connectionActive"] != null && ((bool)HttpContext.Current.Session["mydbobj_connectionActive"]) == true)
            {
                if (HttpContext.Current.Session["mydbobj_sqlDataReader"] != null)
                {
                    try
                    {
                        ((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlDataReader"]).Close();
                    }
                    catch (Exception ex) { } // sqlDataReader deja a fost inchis
                }
                if (HttpContext.Current.Session["mydbobj_sqlConnection"] != null)
                {
                    try
                    {
                        ((SqlConnection)HttpContext.Current.Session["mydbobj_sqlConnection"]).Close();
                    }
                    catch (Exception ex) { } // conexiunea deja a fost inchisa
                }
                HttpContext.Current.Session["mydbobj_connectionActive"] = false;
            }
        }
    }
    public void newQuery(String query)
    {
        if (HttpContext.Current.Session["mydbobj_connectionActive"] != null && (bool)HttpContext.Current.Session["mydbobj_connectionActive"] == true)
        {
            if (HttpContext.Current.Session["mydbobj_sqlDataReader"] != null)
            {
                try
                {
                    ((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlDataReader"]).Close();
                }
                catch (Exception ex) { } // sqlDataReader deja a fost inchis
            }
            if (HttpContext.Current.Session["mydbobj_sqlConnection"] != null)
            {
                try
                {
                    ((SqlConnection)HttpContext.Current.Session["mydbobj_sqlConnection"]).Close();
                }
                catch (Exception ex) { } // conexiunea deja a fost inchisa
            }
        }

        sqlQuery = query;
        HttpContext.Current.Session["mydbobj_sqlConnection"] = new SqlConnection(@"Data Source=.\SQLEXPRESS;Initial Catalog=MMDB;AttachDbFilename=|DataDirectory|\Database.mdf;Integrated Security=True;User Instance=True");
        ((SqlConnection)HttpContext.Current.Session["mydbobj_sqlConnection"]).Open();
        HttpContext.Current.Session["mydbobj_sqlCommand"] = new SqlCommand(sqlQuery, ((SqlConnection)HttpContext.Current.Session["mydbobj_sqlConnection"]));
        HttpContext.Current.Session["mydbobj_connectionActive"] = true;
    }
    public void setParameter(String paramName, object paramValue)
    {
        ((SqlCommand)HttpContext.Current.Session["mydbobj_sqlCommand"]).Parameters.AddWithValue(paramName, paramValue);
    }
    public int ExecuteNonQuery()
    {
        return ((SqlCommand)HttpContext.Current.Session["mydbobj_sqlCommand"]).ExecuteNonQuery();
    }

    public SqlDataReader ExecuteReader()
    {
        HttpContext.Current.Session["mydbobj_sqlReader"] = ((SqlCommand)HttpContext.Current.Session["mydbobj_sqlCommand"]).ExecuteReader();
        return ((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlReader"]);
    }

    public Boolean HasRows()
    {
        HttpContext.Current.Session["mydbobj_sqlReader"] = ((SqlCommand)HttpContext.Current.Session["mydbobj_sqlCommand"]).ExecuteReader();
        return ((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlReader"]).HasRows;
    }

    public SqlDataReader GetSqlDataReader()
    {
        return ((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlReader"]);
    }

    public int GetLastInsertId()
    {
        HttpContext.Current.Session["mydbobj_sqlCommand"] = new SqlCommand("SELECT @@IDENTITY", ((SqlConnection)HttpContext.Current.Session["mydbobj_sqlConnection"]));
        try
        {
            ((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlReader"]).Close();
        }
        catch (Exception ex) { }
        HttpContext.Current.Session["mydbobj_sqlReader"] = ((SqlCommand)HttpContext.Current.Session["mydbobj_sqlCommand"]).ExecuteReader();
        ((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlReader"]).Read();
        return int.Parse(((SqlDataReader)HttpContext.Current.Session["mydbobj_sqlReader"])[0].ToString());
    }
}