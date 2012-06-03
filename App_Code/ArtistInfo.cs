using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for ArtistInfo
/// </summary>
public class ArtistInfo
{
    public int ArtistId;
    public string ArtistName;

	public ArtistInfo(int ArtistId, string ArtistName)
	{
        this.ArtistId = ArtistId;
        this.ArtistName = ArtistName;
	}
}