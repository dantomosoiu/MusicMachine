<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Administrator.aspx.cs" Inherits="Administrator" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Administrator</title>
</head>
<body>
<form id="AdminForm" runat="server">
        <h1>Administrator Module</h1>
        <a  href="index.html">Back to Application</a>
    <div id="AdminSearch" style="margin-top: 10px; margin-bottom: 10px;  margin-left: 5px;  margin-right: 5px">
        <asp:TextBox ID="AdminSearchTextBox" runat="server"></asp:TextBox>
        <asp:Button ID="AdminSearchButton" runat="server" Text="Search"  OnClick="searchUser"/>
    </div>
    
    <asp:Label ID="AdminSearchLabel" Style="margin-top: 10px; margin-bottom: 10px; margin-left: 5px;
        margin-right: 5px" runat="server" Text=""></asp:Label>


    <div id="AdminGridViewContainer" style="margin-top: 5px; margin-bottom: 10px;  margin-left: 5px;  margin-right: 5px">

    <asp:GridView ID="AdminGridView" runat="server"  DataKeyNames="user_id" AutoGenerateColumns="False" 
            CellPadding="4" ForeColor="#333333" GridLines="None">
        <AlternatingRowStyle BackColor="White" />
        <Columns>
            <asp:BoundField DataField="first_name" HeaderText="First Name" SortExpression="first_name" />
            <asp:BoundField DataField="last_name" HeaderText="Last Name" SortExpression="last_name" />
            <asp:BoundField DataField="email" HeaderText="Email" SortExpression="email" />
            <asp:TemplateField HeaderText="Moderator" SortExpression="is_moderator">
                <ItemTemplate>    
                    <asp:CheckBox ID="IsModeratorCheckBox" runat="server" Checked='<%# Eval("is_moderator") %>'
                        AutoPostBack="True" OnCheckedChanged="changeIsModerator" />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:TemplateField HeaderText="Uploader" SortExpression="is_uploader">
                <ItemTemplate>
                    <asp:CheckBox ID="IsUploaderCheckBox" runat="server" Checked='<%# Eval("is_uploader") %>'
                        AutoPostBack="True" OnCheckedChanged="changeIsUploader" />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:TemplateField HeaderText="Administrator" SortExpression="is_admin">
                <ItemTemplate>
                    <asp:CheckBox ID="IsAdminCheckBox" runat="server" Checked='<%# Eval("is_admin") %>'
                        AutoPostBack="True" OnCheckedChanged="changeIsAdmin" />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>


        <EditRowStyle BackColor="#2461BF" />
        <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
        <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
        <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
        <RowStyle BackColor="#EFF3FB" />
        <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
        <SortedAscendingCellStyle BackColor="#F5F7FB" />
        <SortedAscendingHeaderStyle BackColor="#6D95E1" />
        <SortedDescendingCellStyle BackColor="#E9EBEF" />
        <SortedDescendingHeaderStyle BackColor="#4870BE" />


        </asp:GridView>
    </div>
    <div id="AdminMainPage">
        <asp:LinkButton ID="AdminMainPageLinkButton" runat="server" OnClick="adminMainPage" Visible="true">Main Page</asp:LinkButton>
    </div>
</form>
</body>
</html>
