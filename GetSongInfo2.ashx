<%@ WebHandler Language="C#" Class="GetSongInfo" %>

using System;
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json;
using System.Net;
using System.IO;

public class GetSongInfo : IHttpHandler, IRequiresSessionState
{
    
    public void ProcessRequest (HttpContext context) 
    {
        context.Response.ContentType = "application/json";
        String title = context.Request.Params["title"];
        String artist = context.Request.Params["artist"];

        try
        {
            String url = "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=2c56070c796b0b0340385e787089e7a1&limit=1&format=json&track=" + title + "&artist=" + artist;
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