using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for SessionInfo
/// </summary>
public class SessionInfo
{
	public string UserId;
    public string FirstName, LastName;
    public string isModerator, isUploader, isAdmin;

    public SessionInfo(string UserId, string FirstName, string LastName, string isModerator, string isUploader, string isAdmin)
	{
        this.UserId = UserId;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.isModerator = isModerator;
        this.isUploader = isUploader;
        this.isAdmin = isAdmin;
	}
}