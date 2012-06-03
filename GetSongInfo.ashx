﻿<%@ WebHandler Language="C#" Class="GetSongInfo" %>

using System;
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Net;
using System.IO;

public class GetSongInfo : IHttpHandler, IRequiresSessionState
{
    
    public void ProcessRequest (HttpContext context) 
    {
        context.Response.ContentType = "application/json";
        String input = context.Request.Params["songName"];

        String pattern = @"\W";
        input = Regex.Replace(input, pattern, " ");
        pattern = @"[_]";        
        input = Regex.Replace(input, pattern, " ");
        pattern = @"\bmp3\b";
        input = Regex.Replace(input, pattern, "");
        pattern = @"\d";
        input = Regex.Replace(input, pattern, "");
        pattern = @"\band\b";
        input = Regex.Replace(input, pattern, "");
        pattern = @"\bfeat\b";
        input = Regex.Replace(input, pattern, "");
        pattern = @"\brmx\b";
        input = Regex.Replace(input, pattern, "");

        try
        {
            String url = "http://ws.audioscrobbler.com/2.0/?method=track.search&api_key=2c56070c796b0b0340385e787089e7a1&limit=1&format=json&track=" + input;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();

            using (StreamReader sr = new StreamReader(response.GetResponseStream()))
            {
                context.Response.Write(JsonConvert.SerializeObject(sr.ReadToEnd()));
            }
        }
        catch
        {
            context.Response.Write(JsonConvert.SerializeObject("error"));
        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}