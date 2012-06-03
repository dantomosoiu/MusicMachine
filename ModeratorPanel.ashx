<%@ WebHandler Language="C#" Class="ModeratorPanel" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Collections.Generic;


public class ModeratorPanel : ServerResponse
{
    MyDatabase mydb = new MyDatabase();
    
    protected override void Respond(HttpContext context)
    {
        SqlDataReader sqlReader;

        List<ReportedMessage> r = new List<ReportedMessage>();

        if (context.Session["is_moderator"].Equals("True"))
        {
            int i = 0;
            //obtine date despre mesaj: data,titlu, text si despre reporter
            mydb.newQuery(" SELECT [Message].[message_id], [Message].[sender_id], [User].[first_name], [User].[last_name], [User].[email], [Message].[report_date], [Message].[send_date], [Message].[title], [Message].[body] " +
                "FROM [Message] " +
                "JOIN [User] ON [User].[user_id] = [Message].[sender_id] " +
                "WHERE [Message].[report_date] IS NOT NULL AND [Message].[resolved] IS NULL " +
                "ORDER BY [Message].[message_id]");

            sqlReader = mydb.ExecuteReader();

            while (sqlReader.Read())
            {
                BasicInfo reporter = new BasicInfo(-1, "", "", "");
                BasicInfo sender = new BasicInfo(int.Parse(sqlReader["sender_id"].ToString()), sqlReader["first_name"].ToString(), sqlReader["last_name"].ToString(), sqlReader["email"].ToString());
                ShoutboxEntry messDetails = new ShoutboxEntry(int.Parse(sqlReader["message_id"].ToString()), sender, sqlReader["send_date"].ToString(), sqlReader["title"].ToString(), sqlReader["body"].ToString());
                DateTime time_of_report = Convert.ToDateTime(sqlReader["report_date"].ToString());
                r.Add(new ReportedMessage(reporter, messDetails, time_of_report));
                i++;
            }

            //obtine date despre receiver
            mydb.newQuery(" SELECT [Message].[message_id], [Message].[receiver_id], [User].[first_name], [User].[last_name], [User].[email]  " +
            "FROM [Message] " +
            "JOIN [User] ON [User].[user_id] = [Message].[receiver_id] " +
            "WHERE [Message].[report_date] IS NOT NULL AND [Message].[resolved] IS NULL " +
            "ORDER BY [Message].[message_id]");

            sqlReader = mydb.ExecuteReader();

            while (sqlReader.Read())
            {
                i = 0;
                bool found = false;
                while (!found && i < r.Count)
                {
                    if (r[i].Message.MessageId == int.Parse(sqlReader["message_id"].ToString()))
                    {
                        r[i].Message.Receiver.UserId = int.Parse(sqlReader["receiver_id"].ToString());
                        r[i].Message.Receiver.FirstName = sqlReader["first_name"].ToString();
                        r[i].Message.Receiver.LastName = sqlReader["last_name"].ToString();
                        r[i].Message.Receiver.Email = sqlReader["email"].ToString();
                        found = true;
                    }
                    else i++;
                }

            }
            
            
            //obtine date despre reporter
            mydb.newQuery(" SELECT [Message].[message_id], [Message].[reporter_id], [User].[first_name], [User].[last_name], [User].[email]  " +
            "FROM [Message] " +
            "JOIN [User] ON [User].[user_id] = [Message].[reporter_id] " +
            "WHERE [Message].[reporter_id] IS NOT NULL AND [Message].[resolved] IS NULL " +
            "ORDER BY [Message].[message_id]");

            sqlReader = mydb.ExecuteReader();

            while (sqlReader.Read())
            {
                i = 0;
                bool found = false;
                while (!found && i < r.Count)
                {
                    if (r[i].Message.MessageId == int.Parse(sqlReader["message_id"].ToString()))
                    {
                        r[i].Reporter.UserId = int.Parse(sqlReader["reporter_id"].ToString());
                        r[i].Reporter.FirstName = sqlReader["first_name"].ToString();
                        r[i].Reporter.LastName = sqlReader["last_name"].ToString();
                        r[i].Reporter.Email = sqlReader["email"].ToString();
                        found = true;
                    }
                    else i++;
                }

            }
        } 
        
        context.Response.Write(JsonConvert.SerializeObject(r));
    }

}