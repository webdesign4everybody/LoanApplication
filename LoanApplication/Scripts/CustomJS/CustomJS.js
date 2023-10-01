$(document).ready(function () {
    // Example: Attach a click event handler to the btnLogin button\
    window.location.hash = "/";
    renderContent()
    $(window).on('hashchange', function () {
        renderContent();
    });

    function renderContent() {
        let hash = window.location.hash;
        if (hash == '#/') {
            $("#root").html(`<div>
            <h2>Login</h2>
            <div>
                <label for="txtEmail">Email:</label>
                <input type="text" id="loginEmail" />
            </div>
            <div>
                <label for="txtPassword">Password:</label>
                <input type="password" id="loginPassword" />
            </div>
            <div>
                <button id="btnLogin">Login</button>
            </div>
            <div>
                <p>New to Easy Loan? Create account in 5mins.</p>
                <button id="btnSignUp">Sign Up</button>
            </div>
        </div>`)
        }
        else if (hash == '#/SignUp') {
            $("#root").html(`<div>
            <h2>Sign Up</h2>
            <div>
                <label for="txtFName">First Name:</label>
                <input type="text" id="fname" />
            </div>
            <div>
                <label for="txtFName">Middle Name:</label>
                <input type="text" id="mname" />
            </div>
             <div>
                <label for="txtFName">Last Name:</label>
                <input type="text" id="lname" />
            </div>
            <div>
                <label for="txtFName">DOB:</label>
                <input type="date" id="dob" />
            </div>
             <div>
                <label for="txtFName">Email:</label>
                <input type="text" id="email" />
            </div>
            <div>
                <label for="txtFName">PAN No.:</label>
                <input type="text" id="pan" />
            </div>
            <div>
                <label for="txtFName">Mobile No.:</label>
                <input type="text" id="mob" />
            </div>
            <div>
                <label for="txtFName">Password:</label>
                <input type="text" id="pass1" />
            </div>
            <div>
                <label for="txtFName">Re-enter Password:</label>
                <input type="text" id="pass2" />
            </div>
            <div>
                <button id="btnSubmit">Submit</button>&nbsp;<button id="btnSubmitCancel">Cancel</button>
            </div>
            </div>`);
        }
        else if (hash == '#/AdminLogin') {
            if (sessionStorage.length > 0) {
                getAdminLoanRequest('Approved');
                $("#root").html(`<div>
                <div id='radioButtons'>
                   <input type="radio" id="approvedStatus" name="status" value="Approved" />
                   <label for="approvedStatus">Approved Loan Request</label>

                    <input type="radio" id="pendingStatus" name="status" value="Pending" />
                    <label for="pendingStatus">Pending Loan Request</label>

                    <input type="radio" id="rejectedStatus" name="status" value="Rejected" />
                    <label for="rejectedStatus">Rejected Loan Request</label>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Loan ID</th>
                                <th>Loan Amount</th>
                                <th>Tenure</th>
                                <th>Apply Date</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Re-Payment Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="tblApprovedLoan">
                        </tbody>
                    </table>
                </div>
                <div>
                    <button id="btnLogOut">Log Out</button>
                </div>
            </div>`);
            }
            else {
                $("#root").html(`<div>
                    You are not authorised, please login again<br/>
                    <button id="btnHome">Home</button>
                </div>`);
            }
        }
        else if (hash == '#/UserLogin') {
            if (sessionStorage.length > 0) {
                $("#root").html(`<div>
                <div>
                    <h2>Previous Loan Information</h2>&nbsp;&nbsp;&nbsp;<button id="btnGetLoan">Get Loan</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Loan ID</th>
                                <th>Loan Amount</th>
                                <th>Tenure</th>
                                <th>Apply Date</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                 <th>Re-Payment Status</th>
                            </tr>
                        </thead>
                        <tbody id="tblPreviousLoan">
                        </tbody>
                    </table>
                </div>
                <div>
                    <button id="btnLogOut">Log Out</button>
                </div>
            </div>`);
                renderLoanHistory();
            }
            else {
                $("#root").html(`<div>
                    You are not authorised, please login again<br/>
                    <button id="btnHome">Home</button>
                </div>`);
            }
        }
        else if (hash == '#/GetLoan') {
            if (sessionStorage.length > 0) {
                $("#root").html(`<div>
            <h2>Request Loan</h2>
            <div>
                <div>
                    <label>Loan Amount</label>
                    <input id='tempAmount' type='text'/>
                </div>
            </div>
            <div>
                <div>
                    <label>Loan Tenure</label>
                    <input id='tempTenure' type='text'/>
                </div>
            </div>
            <button id="btnGetLoanInfo">Calculate</button>&nbsp;<button id="btnGetLoanCancel">Cancel</button>
            <div id='tempLoanInfo'></div>
            </div>`);
            }
            else {
                $("#root").html(`<div>
                    You are not authorised, please login again<br/>
                    <button id="btnHome">Home</button>
                </div>`);
            }
        }
    }

    function handleRadioChange(radio) {
        const selectedValue = $("input[name='status']:checked").val();
        if (selectedValue) {
            // The radio button is checked
            console.log("Selected Value:", selectedValue);
            // Perform actions based on the selected radio button's value
            // You can add your custom logic here
            getAdminLoanRequest(selectedValue);
        }
    }

    $("#root").on("change", "input[type='radio']", handleRadioChange);

    let getAdminLoanRequest = (Status) => {
        const loanTableBody = document.getElementById('tblApprovedLoan'); // Get the tbody element

        if (loanTableBody != null || loanTableBody != undefined) {
            loanTableBody.innerHTML = ''


            let data = JSON.stringify({
                Status: Status
            })

            $.ajax({
                url: "https://localhost:44360/api/Values/GetLoanRequests",
                type: "POST",
                headers: { // Use 'headers', not 'header'
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose"
                },
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    // Handle the API response here
                    console.log(response);
                    let loanData = JSON.parse(response);
                    console.log(loanData);
                    if (loanData.length > 0) {
                        loanData.forEach((loan) => {
                            const row = document.createElement('tr'); // Create a table row

                            // Create and populate table cells for each loan property
                            const idCell = document.createElement('td');
                            idCell.textContent = loan.LoanId;

                            const amountCell = document.createElement('td');
                            amountCell.textContent = `Rs.${loan.LoanAmount}`;

                            const tenureCell = document.createElement('td');
                            tenureCell.textContent = loan.Tenure;

                            const applyDate = document.createElement('td');
                            applyDate.textContent = loan.ApplyDate;

                            const startDateCell = document.createElement('td');
                            startDateCell.textContent = loan.LoanStartDate;

                            const endDateCell = document.createElement('td');
                            endDateCell.textContent = loan.LoanEndDate;

                            const statusCell = document.createElement('td');
                            statusCell.textContent = loan.LoanStatus;

                            const repaystatusCell = document.createElement('td');
                            repaystatusCell.textContent = loan.RePaymentStatus;

                            // Create a td element
                            const buttonTd = document.createElement('td');

                            if (Status == 'Pending') {

                                // Create a container div for the buttons
                                const buttonContainer = document.createElement('div');

                                // Create the "Approve" button
                                const approveBtn = document.createElement('button');
                                approveBtn.textContent = 'Approve';
                                approveBtn.id = 'approveBtn';
                                approveBtn.value = loan.LoanId;

                                // Create the "Reject" button
                                const rejectBtn = document.createElement('button');
                                rejectBtn.textContent = 'Reject';
                                rejectBtn.id = 'rejectBtn';
                                rejectBtn.value = loan.LoanId;

                                // Append the buttons to the container div
                                buttonContainer.appendChild(approveBtn);
                                buttonContainer.appendChild(rejectBtn);

                                // Append the container div to the td element
                                buttonTd.appendChild(buttonContainer);
                            }

                            // Append cells to the row
                            row.appendChild(idCell);
                            row.appendChild(amountCell);
                            row.appendChild(tenureCell);
                            row.appendChild(applyDate);
                            row.appendChild(startDateCell);
                            row.appendChild(endDateCell);
                            row.appendChild(statusCell);
                            row.appendChild(repaystatusCell);
                            row.appendChild(buttonTd);

                            // Append the row to the table body
                            loanTableBody.appendChild(row);
                        });
                    }
                    else {
                        // If loanData is empty, display a "No data available" message
                        const noDataMessageRow = document.createElement('tr');
                        const noDataMessageCell = document.createElement('td');
                        noDataMessageCell.textContent = 'No data available';
                        noDataMessageCell.setAttribute('colspan', '5'); // Span the message across all columns
                        noDataMessageRow.appendChild(noDataMessageCell);
                        loanTableBody.appendChild(noDataMessageRow);
                    }
                },
                error: function (error) {
                    // Handle errors here
                    console.error("Error:", error);
                    reject(error);
                }
            });
        }
    }

    let renderLoanHistory = () => {
        const loanTableBody = document.getElementById('tblPreviousLoan'); // Get the tbody element

        let data = JSON.stringify({
            UserEmail: sessionStorage.getItem('UserEmail')
        })

        $.ajax({
            url: "https://localhost:44360/api/Values/GetLoanHistory",
            type: "POST",
            headers: { // Use 'headers', not 'header'
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose"
            },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                // Handle the API response here
                console.log(response);
                let loanData = JSON.parse(response);
                console.log(loanData);
                if (loanData.length > 0) {
                    loanData.forEach((loan) => {
                        const row = document.createElement('tr'); // Create a table row

                        // Create and populate table cells for each loan property
                        const idCell = document.createElement('td');
                        idCell.textContent = loan.LoanId;

                        const amountCell = document.createElement('td');
                        amountCell.textContent = `Rs.${loan.LoanAmount}`;

                        const tenureCell = document.createElement('td');
                        tenureCell.textContent = loan.Tenure;

                        const applyDate = document.createElement('td');
                        applyDate.textContent = loan.ApplyDate;

                        const startDateCell = document.createElement('td');
                        startDateCell.textContent = loan.LoanStartDate;

                        const endDateCell = document.createElement('td');
                        endDateCell.textContent = loan.LoanEndDate;

                        const statusCell = document.createElement('td');
                        statusCell.textContent = loan.LoanStatus;

                        const repaystatusCell = document.createElement('td');
                        repaystatusCell.textContent = loan.RePaymentStatus;

                        // Append cells to the row
                        row.appendChild(idCell);
                        row.appendChild(amountCell);
                        row.appendChild(tenureCell);
                        row.appendChild(applyDate);
                        row.appendChild(startDateCell);
                        row.appendChild(endDateCell);
                        row.appendChild(statusCell);
                        row.appendChild(repaystatusCell);

                        if (loan.RePaymentStatus == 'Pending' && loan.LoanStatus == 'Approved') {
                            
                            // Create the "Approve" button
                            const repayBtn = document.createElement('button');
                            repayBtn.textContent = 'Pay';
                            repayBtn.id = 'repayBtn';
                            repayBtn.value = loan.LoanId;

                            // Append the container div to the td element
                            row.appendChild(repayBtn);
                        }

                        // Append the row to the table body
                        loanTableBody.appendChild(row);
                    });
                }
                else {
                    // If loanData is empty, display a "No data available" message
                    const noDataMessageRow = document.createElement('tr');
                    const noDataMessageCell = document.createElement('td');
                    noDataMessageCell.textContent = 'No data available';
                    noDataMessageCell.setAttribute('colspan', '5'); // Span the message across all columns
                    noDataMessageRow.appendChild(noDataMessageCell);
                    loanTableBody.appendChild(noDataMessageRow);
                }
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
                reject(error);
            }
        });
    }

    let checkUser = (id, pass) => {
        return new Promise((resolve, reject) => {
            console.log(id, pass);
            let data = JSON.stringify({
                loginID: id,
                pass: pass
            });

            $.ajax({
                url: "https://localhost:44360/api/Values/ValidateLogin",
                type: "POST",
                headers: { // Use 'headers', not 'header'
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose"
                },
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    // Handle the API response here
                    console.log(response);
                    let userInfo = JSON.parse(response);
                    console.log(userInfo);
                    resolve(userInfo)
                },
                error: function (error) {
                    // Handle errors here
                    console.error("Error:", error);
                    reject(error);
                }
            });
        })
    }

    let renderLandingPage = () => {
        let isAdmin = sessionStorage.getItem('UserRole');
        if (isAdmin == 'Admin') {
            window.location.hash = '#/AdminLogin';
        }
        else {
            window.location.hash = '#/UserLogin';
        }
    }

    let submitData = (fname, mname, lname, dob, pan, email, mob, pass) => {
        return new Promise((resolve, reject) => {
            let data = JSON.stringify({
                fname: fname,
                mname: mname,
                lname: lname,
                email: email,
                pan: pan,
                dob: dob,
                mob: mob,
                pass: pass
            });

            $.ajax({
                url: "https://localhost:44360/api/Values/CreateAccount",
                type: "POST",
                headers: { // Use 'headers', not 'header'
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose"
                },
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    // Handle the API response here
                    console.log(response);
                    if (response == "Success") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Account Created Successfully!'
                        });
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Something went wrong!'
                        });
                    }
                },
                error: function (error) {
                    // Handle errors here
                    console.error("Error:", error);
                    reject(error);
                }
            });
        })
    }

    $("#root").on("click", "#btnLogin", function (e) {
        e.preventDefault();
        let loginEmail = $("#loginEmail").val();
        let loginPassword = $("#loginPassword").val();

        checkUser(loginEmail, loginPassword).then((response) => {
            if (response.length > 0) {
                Swal.fire("You are welcome " + response[0].FirstName + " " + response[0].LastName).then(() => {
                    window.location.hash = '/GetLoan'
                }).then(() => {
                    sessionStorage.setItem('UserRole', response[0].UserRole);
                    sessionStorage.setItem('UserEmail', loginEmail);
                    sessionStorage.setItem('Password', loginPassword);
                    renderLandingPage();
                });
            }
            else {
                Swal.fire("Please Create Account");
            }
        })
    });

    $("#root").on("click", "#btnSignUp", function (e) {
        e.preventDefault();
        window.location.hash = "/SignUp";
    });

    $("#root").on("click", "#btnSubmit", function (e) {
        e.preventDefault();
        let fname = $("#fname").val();
        let mname = $("#mname").val();
        let lname = $("#lname").val();
        let dob = $("#dob").val();
        let email = $("#email").val();
        let pan = $("#pan").val();
        let mob = $("#mob").val();
        let pass1 = $("#pass1").val();
        let pass2 = $("#pass2").val();
        if (pass1 == "" || pass2 == "" || pass1 == null || pass2 == null) {
            Swal.fire({
                icon: 'warning',
                title: 'Please enter valid password'
            })
        }
        else if (pass1 !== pass2) {
            Swal.fire({
                icon: 'warning',
                title: 'Please enter same password in both fields'
            })
        }
        else {
            submitData(fname, mname, lname, dob, pan, email, mob, pass1);
        }
        console.log(fname);
    });

    $("#root").on("click", "#btnSubmitCancel", function (e) {
        e.preventDefault();
        let fname = $("#fname").val();
        let mname = $("#mname").val();
        let lname = $("#lname").val();
        let dob = $("#dob").val();
        let email = $("#email").val();
        let pan = $("#pan").val();
        let mob = $("#mob").val();
        let pass1 = $("#pass1").val();
        let pass2 = $("#pass2").val();

        window.location.hash = "/";
    });

    $("#root").on("click", "#btnGetLoanCancel", function (e) {
        e.preventDefault();
        window.location.hash = "/UserLogin";
    });

    $("#root").on("click", "#btnLogOut", function (e) {
        e.preventDefault();
        sessionStorage.clear();
        window.location.hash = "/";
    })

    $("#root").on("click", "#btnHome", function (e) {
        e.preventDefault();
        sessionStorage.clear();
        window.location.hash = "/";
    })

    $("#root").on("click", "#btnGetLoan", function (e) {
        e.preventDefault();
        window.location.hash = "/GetLoan";
    });

    $("#root").on("click", "#btnSubmitLoanReq", function (e) {
        e.preventDefault();
        Swal.fire({
            title: 'Confirmation',
            text: 'Are you sure you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const applyDate = new Date(); // Create a Date object representing the current date and time
                const formattedApplyDate = applyDate.toLocaleDateString(); // Get the current date in the desired format
                let data = JSON.stringify({
                    UserEmail: sessionStorage.getItem('UserEmail'),
                    LoanAmount: $('#tempAmount').val(),
                    Tenure: $('#tempTenure').val(),
                    ApplyDate: formattedApplyDate,
                    StartDate: document.getElementById('StartDate').textContent,
                    EndDate: document.getElementById('LastDate').textContent,
                })
                $.ajax({
                    url: "https://localhost:44360/api/Values/SubmitLoanRequest",
                    type: "POST",
                    headers: { // Use 'headers', not 'header'
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose"
                    },
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        // Handle the API response here
                        console.log(response);
                        if (response == 'Success') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Request submitted successfully!'
                            }).then(() => {
                                window.location.hash ='/UserLogin'
                            })
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Something went wrong!'
                            })
                        }
                    },
                    error: function (error) {
                        // Handle errors here
                        console.error("Error:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Something went wrong!'
                        })
                    }
                });
            } else {

            }
        });

    });

    $("#root").on("click", "#btnGetLoanInfo", function (e) {
        e.preventDefault();
        $("#tempLoanInfo").html(`<table>
                     <thead>
                            <tr>
                                <th>EMI No.</th>
                                <th>EMI Amount</th>
                                <th>Scheduled Repayment</th>
                            </tr>
                        </thead>
                        <tbody id="tblTempLoanInfo">
                        </tbody>
                </table>
                <div>
                    <button id="btnSubmitLoanReq">Submit Request</button>&nbsp;&nbsp;<button id="btnGetLoanCancel">Cancel</button>
                </div>`);

        let loanAmount = $('#tempAmount').val();
        let tenure = $('#tempTenure').val();

        let applyDate = Date.now();
        console.log(applyDate + 7);

        let tempLoanInfo = document.getElementById('tblTempLoanInfo');

        for (let i = 0; i < tenure; i++) {
            const row = document.createElement('tr'); // Create a table row

            // Create and populate table cells for each loan property
            const idCell = document.createElement('td');
            idCell.textContent = i + 1;

            const amountCell = document.createElement('td');
            amountCell.textContent = `Rs.${loanAmount / tenure}`;

            const startDateCell = document.createElement('td');
            let repaymentDate = new Date(applyDate + 7 * 24 * 60 * 60 * 1000 * (i + 1)); // Calculate the repayment date for each row
            startDateCell.textContent = repaymentDate.toLocaleDateString(); // Convert date to a readable format
            startDateCell.id = i == 0 ? 'StartDate' : i == tenure - 1 ? 'LastDate' : i;

            row.appendChild(idCell);
            row.appendChild(amountCell);
            row.appendChild(startDateCell);

            tempLoanInfo.appendChild(row);
        }


    });

    $("#root").on("click", "#approveBtn", function (e) {
        e.preventDefault();
        let loanID = $('#approveBtn').val()

        let data = JSON.stringify({ Status: 'Approved', LoanID: loanID })
        $.ajax({
            url: "https://localhost:44360/api/Values/ApproveRejectLoanRequests",
            type: "POST",
            headers: { // Use 'headers', not 'header'
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose"
            },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                // Handle the API response here
                console.log(response);
                if (response == "Success") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Request Approved Successfully!'
                    }).then(() => {
                        getAdminLoanRequest('Pending');
                    });
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong!'
                    });
                }
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
                reject(error);
            }
        });
    });

    $("#root").on("click", "#rejectBtn", function (e) {
        e.preventDefault();

        let loanID = $('#rejectBtn').val();
        let data = JSON.stringify({ Status: 'Rejected', LoanID: loanID })
        $.ajax({
            url: "https://localhost:44360/api/Values/ApproveRejectLoanRequests",
            type: "POST",
            headers: { // Use 'headers', not 'header'
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose"
            },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                // Handle the API response here
                console.log(response);

                if (response == "Success") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Request Rejected Successfully!'
                    }).then(() => {
                        getAdminLoanRequest('Pending');
                    });;
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong!'
                    });
                }
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
                reject(error);
            }
        });
    });

    $("#root").on("click", "#repayBtn", function (e) {
        e.preventDefault();

        let loanID = $('#rejectBtn').val();
        let data = JSON.stringify({ Status: 'Rejected', LoanID: loanID })
        $.ajax({
            url: "https://localhost:44360/api/Values/ApproveRejectLoanRequests",
            type: "POST",
            headers: { // Use 'headers', not 'header'
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose"
            },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                // Handle the API response here
                console.log(response);

                if (response == "Success") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Request Rejected Successfully!'
                    }).then(() => {
                        getAdminLoanRequest('Pending');
                    });;
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong!'
                    });
                }
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
                reject(error);
            }
        });
    });
});