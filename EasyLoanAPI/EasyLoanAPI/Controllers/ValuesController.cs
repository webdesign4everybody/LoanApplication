using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace EasyLoanAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ValuesController : ApiController
    {
        [HttpPost]
        [Route("api/Values/ValidateLogin")]
        public string ValidateLogin([FromBody] string IdPass)
        {
            JObject obj = JObject.Parse(IdPass);
            string ID = (string)obj["loginID"];
            string Password = (string)obj["pass"];

            string cs = ConfigurationManager.ConnectionStrings["EasyLoan"].ConnectionString;
            SqlConnection sqlConnection = new SqlConnection(cs);
            SqlCommand sqlCommand = new SqlCommand("GetUserInformation", sqlConnection);
            sqlCommand.CommandType = CommandType.StoredProcedure;

            sqlCommand.Parameters.AddWithValue("@ID", ID);
            sqlCommand.Parameters.AddWithValue("@Password", Password);
            SqlDataAdapter dataAdapter = new SqlDataAdapter(sqlCommand);
            DataTable userInfo = new DataTable();
            dataAdapter.Fill(userInfo);
            return JsonConvert.SerializeObject(userInfo);
        }

        [HttpPost]
        [Route("api/Values/CreateAccount")]
        public string CreateAccount([FromBody] string UserData)
        {
            JObject obj = JObject.Parse(UserData);

            string fname = (string)obj["fname"];
            string mname = (string)obj["mname"];
            string lname = (string)obj["lname"];
            string dob = (string)obj["dob"];
            string pan = (string)obj["pan"];
            string email = (string)obj["email"];
            string mob = (string)obj["mob"];
            string pass = (string)obj["pass"];

            string cs = ConfigurationManager.ConnectionStrings["EasyLoan"].ConnectionString;
            SqlConnection sqlConnection = new SqlConnection(cs);
            SqlCommand sqlCommand = new SqlCommand("InsertUserInformation", sqlConnection);
            sqlCommand.CommandType = CommandType.StoredProcedure;

            sqlCommand.Parameters.AddWithValue("@Password", pass);
            sqlCommand.Parameters.AddWithValue("@FirstName", fname);
            sqlCommand.Parameters.AddWithValue("@MiddleName", mname);
            sqlCommand.Parameters.AddWithValue("@LastName", lname);
            sqlCommand.Parameters.AddWithValue("@EmailID", email);
            sqlCommand.Parameters.AddWithValue("@DOB", dob);
            sqlCommand.Parameters.AddWithValue("@PanNO", pan);
            sqlCommand.Parameters.AddWithValue("@MobNO", mob);

            sqlConnection.Open();
            string response = (string)sqlCommand.ExecuteScalar();
            sqlConnection.Close();
            return response;
        }

        [HttpPost]
        [Route("api/Values/GetLoanHistory")]
        public string GetLoanHistory([FromBody] string UserData)
        {
            JObject obj = JObject.Parse(UserData);

            string UserEmail = (string)obj["UserEmail"];

            string cs = ConfigurationManager.ConnectionStrings["EasyLoan"].ConnectionString;
            SqlConnection sqlConnection = new SqlConnection(cs);
            SqlCommand sqlCommand = new SqlCommand("GetLoanHistory", sqlConnection);
            sqlCommand.CommandType = CommandType.StoredProcedure;

            sqlCommand.Parameters.AddWithValue("@UserEmail", UserEmail);

            SqlDataAdapter dataAdapter = new SqlDataAdapter(sqlCommand);
            DataTable userInfo = new DataTable();
            dataAdapter.Fill(userInfo);
            return JsonConvert.SerializeObject(userInfo);
        }

        [HttpPost]
        [Route("api/Values/SubmitLoanRequest")]
        public string SubmitLoanRequest([FromBody] string UserData)
        {
            try
            {
                JObject obj = JObject.Parse(UserData);

                string UserEmail = (string)obj["UserEmail"];
                int LoanAmount = (int)obj["LoanAmount"];
                int Tenure = (int)obj["Tenure"];
                string ApplyDate = (string)obj["ApplyDate"];
                string StartDate = (string)obj["StartDate"];
                string EndDate = (string)obj["EndDate"];

                string cs = ConfigurationManager.ConnectionStrings["EasyLoan"].ConnectionString;
                SqlConnection sqlConnection = new SqlConnection(cs);
                SqlCommand sqlCommand = new SqlCommand("InsertLoanRequest", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.AddWithValue("@UserEmail", UserEmail);
                sqlCommand.Parameters.AddWithValue("@LoanAmount", LoanAmount);
                sqlCommand.Parameters.AddWithValue("@Tenure", Tenure);
                sqlCommand.Parameters.AddWithValue("@ApplyDate", ApplyDate);
                sqlCommand.Parameters.AddWithValue("@StartDate", StartDate);
                sqlCommand.Parameters.AddWithValue("@EndDate", EndDate);

                sqlConnection.Open();
                string response = (string)sqlCommand.ExecuteScalar();
                sqlConnection.Close();
                return response;
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                return "Failed" + message;
            }
        } 
        
        [HttpPost]
        [Route("api/Values/GetLoanRequests")]
        public string GetLoanRequests([FromBody] string UserData)
        {
            try
            {
                JObject obj = JObject.Parse(UserData);

                string Status = (string)obj["Status"];

                string cs = ConfigurationManager.ConnectionStrings["EasyLoan"].ConnectionString;
                SqlConnection sqlConnection = new SqlConnection(cs);
                SqlCommand sqlCommand = new SqlCommand("GetLoanRequestForAdmin", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.AddWithValue("@Status", Status);

                SqlDataAdapter dataAdapter = new SqlDataAdapter(sqlCommand);
                DataTable userInfo = new DataTable();
                dataAdapter.Fill(userInfo);
                return JsonConvert.SerializeObject(userInfo);

            }
            catch (Exception ex)
            {
                string message = ex.Message;
                return "Failed" + message;
            }
        }
        
        [HttpPost]
        [Route("api/Values/ApproveRejectLoanRequests")]
        public string ApproveRejectLoanRequests([FromBody] string UserData)
        {
            try
            {
                JObject obj = JObject.Parse(UserData);

                string Status = (string)obj["Status"];
                string LoanID = (string)obj["LoanID"];

                string cs = ConfigurationManager.ConnectionStrings["EasyLoan"].ConnectionString;
                SqlConnection sqlConnection = new SqlConnection(cs);
                SqlCommand sqlCommand = new SqlCommand("ApproveRejectLoanRequest", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.AddWithValue("@Status", Status);
                sqlCommand.Parameters.AddWithValue("@LoanID", LoanID);

                sqlConnection.Open();
                string response = (string)sqlCommand.ExecuteScalar();
                sqlConnection.Close();
                return response;

            }
            catch (Exception ex)
            {
                string message = ex.Message;
                return "Failed" + message;
            }
        }

        [HttpPost]
        [Route("api/Values/RepayLoan")]
        public string RepayLoan([FromBody] string UserData)
        {
            try
            {
                JObject obj = JObject.Parse(UserData);

                string Amount = (string)obj["RepayAmount"];
                string LoanID = (string)obj["LoanID"];

                string cs = ConfigurationManager.ConnectionStrings["EasyLoan"].ConnectionString;
                SqlConnection sqlConnection = new SqlConnection(cs);
                SqlCommand sqlCommand = new SqlCommand("RepayLoanAmount", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.AddWithValue("@Amount", Amount);
                sqlCommand.Parameters.AddWithValue("@LoanID", LoanID);

                sqlConnection.Open();
                string response = (string)sqlCommand.ExecuteScalar();
                sqlConnection.Close();
                return response;

            }
            catch (Exception ex)
            {
                string message = ex.Message;
                return "Failed" + message;
            }
        }
    }

}
