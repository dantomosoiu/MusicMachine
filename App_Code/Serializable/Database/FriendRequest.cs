using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for FriendRequest
/// </summary>
public class FriendRequest
{
    public BasicInfo Sender;
    public string Status;

	public FriendRequest(BasicInfo Sender, string Status)
	{
        this.Sender = Sender;
        this.Status = Status;
	}
}