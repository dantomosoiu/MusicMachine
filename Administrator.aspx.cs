using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Data.SqlClient;
using System.Data.Sql;

public partial class Administrator : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            LoadData();
        }
    }

    private void LoadData()
    {
        if (Session["is_admin"].Equals("True"))
        {

            AdminSearchLabel.Text = "";
            AdminMainPageLinkButton.Visible = false;

            string constr = @"Data Source=.\SQLEXPRESS;Initial Catalog=MMDB;AttachDbFilename=|DataDirectory|\Database.mdf;Integrated Security=True;User Instance=True";
            string query = @"SELECT user_id, email, last_name, first_name, is_moderator, is_uploader, is_admin FROM [User] WHERE (is_moderator = 'True') OR (is_uploader = 'True') OR (is_admin = 'True')";

            SqlDataAdapter da = new SqlDataAdapter(query, constr);
            DataTable table = new DataTable();
            da.Fill(table);

            AdminGridView.DataSource = table;
            AdminGridView.DataBind();
        }
        else
        {
            noAdminContent();
        }

    }

    public void changeIsModerator(object sender, EventArgs e)
    {
        if (Session["is_admin"].Equals("True"))
        {
            CheckBox chkStatus = (CheckBox)sender;
            GridViewRow row = (GridViewRow)chkStatus.NamingContainer;

            DataKey uid = AdminGridView.DataKeys[row.RowIndex];
            bool status = chkStatus.Checked;

            string constr = @"Data Source=.\SQLEXPRESS;Initial Catalog=MMDB;AttachDbFilename=|DataDirectory|\Database.mdf;Integrated Security=True;User Instance=True";
            string query = "UPDATE [User] SET is_moderator = @isModerator WHERE user_id = @userId";

            SqlConnection con = new SqlConnection(constr);
            SqlCommand com = new SqlCommand(query, con);

            com.Parameters.Add("@isModerator", SqlDbType.Bit).Value = status;
            com.Parameters.Add("@userId", SqlDbType.Int).Value = (int)uid.Value;
            con.Open();
            com.ExecuteNonQuery();
            con.Close();

            //daca modific chiar drepturile utilizatorului curent
            if (uid.Value.ToString().Equals(Session["user_id"]))
                Session["is_moderator"] = status;
        }
        else
        {
            noAdminContent();
        }

    } 

    public void changeIsUploader(object sender, EventArgs e)
    {
        if (Session["is_admin"].Equals("True"))
        {
            CheckBox chkStatus = (CheckBox)sender;
            GridViewRow row = (GridViewRow)chkStatus.NamingContainer;

            DataKey uid = AdminGridView.DataKeys[row.RowIndex];
            bool status = chkStatus.Checked;

            string constr = @"Data Source=.\SQLEXPRESS;Initial Catalog=MMDB;AttachDbFilename=|DataDirectory|\Database.mdf;Integrated Security=True;User Instance=True";
            string query = "UPDATE [User] SET is_uploader = @isUploader WHERE user_id = @userId";

            SqlConnection con = new SqlConnection(constr);
            SqlCommand com = new SqlCommand(query, con);

            com.Parameters.Add("@isUploader", SqlDbType.Bit).Value = status;
            com.Parameters.Add("@userId", SqlDbType.Int).Value = (int)uid.Value;

            con.Open();
            com.ExecuteNonQuery();
            con.Close();

            //daca modific chiar drepturile utilizatorului curent
            if (uid.Value.ToString().Equals(Session["user_id"]))
                Session["is_uploader"] = status;
        }
        else
        {
            noAdminContent();
        }
    } 

    public void changeIsAdmin(object sender, EventArgs e)
    {
        if (Session["is_admin"].Equals("True"))
        {
            CheckBox chkStatus = (CheckBox)sender;
            GridViewRow row = (GridViewRow)chkStatus.NamingContainer;

            DataKey uid = AdminGridView.DataKeys[row.RowIndex];
            bool status = chkStatus.Checked;

            string constr = @"Data Source=.\SQLEXPRESS;Initial Catalog=MMDB;AttachDbFilename=|DataDirectory|\Database.mdf;Integrated Security=True;User Instance=True";
            string query = "UPDATE [User] SET is_admin = @isAdmin WHERE user_id = @userId";

            SqlConnection con = new SqlConnection(constr);
            SqlCommand com = new SqlCommand(query, con);


            com.Parameters.Add("@isAdmin", SqlDbType.Bit).Value = status;
            com.Parameters.Add("@userId", SqlDbType.Int).Value = (int)uid.Value;

            con.Open();
            com.ExecuteNonQuery();
            con.Close();

            //daca modific chiar drepturile utilizatorului curent
            if (uid.Value.ToString().Equals(Session["user_id"]))
                Session["is_admin"] = status;
        }
        else
        {
            noAdminContent();
        }

    }

    protected void searchUser(object sender, EventArgs e)
    {
        if (Session["is_admin"].Equals("True"))
        {
            string text = Server.UrlDecode(AdminSearchTextBox.Text);
            AdminMainPageLinkButton.Visible = true;
            DataTable table = new DataTable();
            String mess1;

            if (text.Equals("") || text.Equals(" "))
            {
                mess1 = Convert.ToString("Illegal character!");
            }
            else
            {
                text = text.Trim();
                if (text.Contains(" "))
                    text = text.Substring(0, text.IndexOf(" "));

                string constr = @"Data Source=.\SQLEXPRESS;Initial Catalog=MMDB;AttachDbFilename=|DataDirectory|\Database.mdf;Integrated Security=True;User Instance=True";
                string query = @"SELECT user_id, email, last_name, first_name, is_moderator, is_uploader, is_admin FROM [User] WHERE UPPER(last_name) LIKE @llast_name OR UPPER(first_name) LIKE @ffirst_name OR UPPER(email) LIKE @eemail";

                SqlConnection con = new SqlConnection(constr);
                con.Open();
                SqlCommand com = new SqlCommand(query, con);
                String text1 = Convert.ToString("%" + text.ToUpper() + "%");
                com.Parameters.AddWithValue("ffirst_name", text1);
                com.Parameters.AddWithValue("llast_name", text1);
                com.Parameters.AddWithValue("eemail", text1);

                SqlDataAdapter da = new SqlDataAdapter(com);
                da.Fill(table);

                if (table.Rows.Count > 1)
                    mess1 = Convert.ToString(table.Rows.Count + " results for users who have first name, last name or email containing '" + text + "'. ");
                else if (table.Rows.Count == 1)
                    mess1 = Convert.ToString("1 result for users who have first name, last name or email containing '" + text + "'. ");
                else
                    mess1 = Convert.ToString("No result for users who have first name, last name or email containing '" + text + "'. ");
            }

            AdminSearchLabel.Text = mess1;
            AdminGridView.DataSource = table;
            AdminGridView.DataBind();

        }
        else
        {
            noAdminContent();
        }
    }

    protected void adminMainPage(object sender, EventArgs e)
    {
        if (Session["is_admin"].Equals("True"))
        {

            AdminSearchTextBox.Text = "";
            LoadData();
        }
        else
        {
            noAdminContent();
        }
    }

    //afiseaza un mesaj corespunzator in cazul in care persoana nu este administrator
    private void noAdminContent()
    {
        AdminSearchLabel.Text = Convert.ToString("You have to be administrator to visualize this page.");
        AdminSearchTextBox.Visible = false;
        AdminSearchButton.Visible = false;
        AdminMainPageLinkButton.Visible = false;
    }

}