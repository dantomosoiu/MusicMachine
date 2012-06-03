using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Se foloseste la afisarea informatiilor despre mesajele raportate, in panoul de moderare. 
/// </summary>
public class ReportedMessage
{
    public BasicInfo Reporter;
    public ShoutboxEntry Message;
    public DateTime ReportDate;

	public ReportedMessage(BasicInfo Reporter, ShoutboxEntry Message, DateTime ReportDate)
	{
        this.Reporter = Reporter;
        this.Message = Message;
        this.ReportDate = ReportDate;
	}
}