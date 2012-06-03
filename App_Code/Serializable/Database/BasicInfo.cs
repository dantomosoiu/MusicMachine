using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Obiectele de acest tip sunt utile pentru a raspunde la request-uri care necesita informatii sumare despre utilizatori
/// (de exemplu: lista de prieteni, informatiile minimale despre utilizatori in diverse contexte: mesaje/melodii raportate,
/// shoutbox, news feed, etc.).
/// </summary>
public class BasicInfo
{
    public int UserId;
    public string FirstName, LastName;
    public string Email;

	public BasicInfo(int UserId, string FirstName, string LastName, string Email)
	{
        this.UserId = UserId;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
	}
}