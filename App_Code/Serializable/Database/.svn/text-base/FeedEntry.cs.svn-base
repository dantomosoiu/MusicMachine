using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Element de baza pentru redarea informatiilor in news feed. Exista 4 tipuri de evenimente publicate:
/// - recomandarea unei melodii utilizatorului curent, prietenilor acestuia sau de catre acestia 
/// (EventType = "recommendation", Event de tip RecommendedSong)
/// - primirea unei cereri de prietenie (EventType = "friend_request", Event de tip BasicInfo)
/// - primirea unui mesaj pe shoutbox (EventType = "shoutbox_message", Event de tip ShoutboxEntry)
/// - actualizarea profilului de catre unul din prietenii utilizatorului 
/// (EventType = "profile_update", Event de tip BasicInfo)
/// EventDate reprezinta invariabil data cand a avut loc evenimentul.
/// </summary>
public class FeedEntry
{
    public string EventType;
    public string EventDate;
    public DateTime EventDateSort;
    public Object Event;

	public FeedEntry(string EventType, string EventDate, DateTime EventDateSort, Object Event)
	{
        this.EventType = EventType;
        this.EventDate = EventDate;
        this.EventDateSort = EventDateSort;
        this.Event = Event;
	}
}