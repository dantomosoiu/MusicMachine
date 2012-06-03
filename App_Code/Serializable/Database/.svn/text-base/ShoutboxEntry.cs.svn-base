using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Se foloseste pentru afisarea shoutbox-ului sau in news feed.
/// </summary>
public class ShoutboxEntry
{
    public int MessageId;
    public BasicInfo Sender;
    public string SendDate;
    public string Title;
    public string Body;
    public BasicInfo Receiver;

	public ShoutboxEntry(int MessageId, BasicInfo Sender, string SendDate, string Title, string Body)
	{
        this.MessageId = MessageId;
        this.Sender = Sender;
        this.SendDate = SendDate;
        this.Title = Title;
        this.Body = Body;
        this.Receiver = new BasicInfo(-1, "", "", "");
	}
}