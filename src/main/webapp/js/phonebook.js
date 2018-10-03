// Class to represent a row in the seat reservations grid
function Contact(firstName, lastName, phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
}

function contactToString(contact) {
    var note = "(";
    note += contact.firstName + ", ";
    note += contact.lastName + ", ";
    note += contact.phone;
    note += ")";
    return note;
}


$(document).ready(function () {
    var btn = $("#addContact");
    btn.on("click", function () {
        var firstName = $("#firstName");
        var lastName = $("#lastName");
        var phone = $("#phone");
        var contact = new Contact(firstName.val(), lastName.val(), phone.val());
        $.ajax({
            type: "POST",
            url: "/phonebook/add",
            data: JSON.stringify(contact)
        }).done(function (response) {
            //console.log(response);
            //console.log(JSON.parse(response));
            //console.log("Добавилось. Всё ОК");
            //console.log(response);

        }).fail(function (ajaxRequest) {
            var contactValidation = $.parseJSON(ajaxRequest.responseText);
        }).always(function () {
            $.ajax({
                type: "GET",
                url: "/phonebook/get/all",
                success: function (response) {
                    var contacts = JSON.parse(response);
                    drawTable(contacts);
                }
            });
            //console.log("Всё ОК");
            firstName.val("");
            lastName.val("");
            phone.val("");
        });
    });

    $.ajax({
        type: "GET",
        url: "/phonebook/get/all",
        success: function (response) {
            var contacts = JSON.parse(response);
            drawTable(contacts);
        }
    });
    var drawTable = function (contacts) {
        $(".tbody").find("tr").remove();
        if (!contacts.length == 0) {
            _.each(contacts, function (el, index) {
        var tr = $("<tr class='tr'><td></td><td></td><td></td><td></td><td></td>" +
            "<td><button class='btn btn-primary delete-btn'  type='button'>" +
            "Удалить</button></td></tr>");
        tr.find("td:eq(1)").text(el.id);
        tr.find("td:eq(2)").text(el.lastName);
        tr.find("td:eq(3)").text(el.firstName);
        tr.find("td:eq(4)").text(el.phone);
        $(".table").find(".tbody").append(tr);
        });
        deleteContact();
    }else{
        return;
    }
    };

    function deleteContact() {
        var deleteBtn = $(".delete-btn");
        deleteBtn.on("click", function () {
            var id = $(this).closest("tr").find("td:eq(1)").text();
            var firstName = $(this).closest("tr").find("td:eq(3)").text();
            var lastName = $(this).closest("tr").find("td:eq(2)").text();
            var phone = $(this).closest("tr").find("td:eq(4)").text();
            var contact = new Contact(firstName, lastName, phone);
            contact.id = id;
            //console.log("Delete Button Pressed");
            $.ajax({
                type: "POST",
                url: "/phonebook/delete",
                data: JSON.stringify(contact)
            }).done(function (response) {
                $.ajax({
                    type: "GET",
                    url: "/phonebook/get/all",
                    success: function (response) {
                        var contacts = JSON.parse(response);
                        drawTable(contacts);
                    }
                })
            });
        });
    }
});



