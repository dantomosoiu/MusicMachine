<%@ WebHandler Language="C#" Class="Handler2" %>

using System;
using System.Web;
using System.Data.SqlClient;
using System.Collections.Generic;
using Newtonsoft.Json;

public class Handler2 : ServerResponse {

    public static int CalculateAge(DateTime BirthDate)
    {
        int YearsPassed = DateTime.Now.Year - BirthDate.Year;
        if (DateTime.Now.Month < BirthDate.Month || (DateTime.Now.Month == BirthDate.Month && DateTime.Now.Day < BirthDate.Day))
        {
            YearsPassed--;
        }
        return YearsPassed;
    }

    protected override void Respond(HttpContext context)
    {
        MyDatabase mydb = new MyDatabase();
        string errorMsg;
        SqlDataReader reader;

        mydb.newQuery(
            "SELECT [User].user_id, [User].first_name, [User].last_name, [User].sex,  [User].birth_date, [User].location " +
            "FROM [User], [FriendRequests] " +
            "WHERE [User].user_id = [FriendRequests].sender_id AND [FriendRequests].receiver_id = @userid AND status='pending'"
        );
        mydb.setParameter("userid", context.Session["user_id"].ToString());
        reader = mydb.ExecuteReader();

        if (!reader.HasRows)
        {
            errorMsg = "No friend requests!";
            context.Response.Write(JsonConvert.SerializeObject(errorMsg));
            return;
        }
        else
        {
            List<PersonalInfo> friendsArray = new List<PersonalInfo>();
            int age;
            DateTime birthDate;
            while (reader.Read())
            {
                if (!reader["birth_date"].ToString().Equals(""))
                {
                    birthDate = DateTime.Parse(reader["birth_date"].ToString());
                    age = CalculateAge(birthDate);
                }
                else
                {
                    age = -1;
                }
                PersonalInfo friend = new PersonalInfo(
                    reader["user_id"].ToString(),
                    reader["first_name"].ToString(),
                    reader["last_name"].ToString(),
                    reader["sex"].ToString(),
                    age,
                    reader["location"].ToString()
                );
                friendsArray.Add(friend);
            }
            context.Response.Write(JsonConvert.SerializeObject(friendsArray));
        }
    }
    

}